import * as THREE from "three";
import { createRBTree, RBTree } from "./RBTree";
import { GRAVITY } from "./constants";
import { JugglingEvent } from "./Timeline";
import * as Tone from "tone";

// function create_audio(note_name: string): HTMLAudioElement {
//     throw new Error("Not implemented");
// }

//TODO : Fusionner les évènements de main et de balles ?

class Ball {
    readonly color: number | string;
    readonly radius: number;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh;
    sound: Tone.Players | Tone.Player | undefined;
    panner3D: Tone.Panner3D | undefined;
    timeline: RBTree<number, JugglingEvent>;
    prev_time = 0;

    constructor(
        color: number | string,
        radius: number,
        sound?: Tone.Players | Tone.Player | string,
        panner3D?: Tone.Panner3D,
        timeline?: RBTree<number, JugglingEvent>
    ) {
        this.color = color;
        this.radius = radius;
        this.geometry = new THREE.SphereGeometry(radius, 8, 4);
        this.material = new THREE.MeshPhongMaterial({ color: this.color });
        //TODO: CHeck if destroying mesh detroys material and or geometry.
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        if (timeline === undefined) {
            this.timeline = createRBTree();
        } else {
            this.timeline = structuredClone(timeline);
        }

        if (typeof sound === "string") {
            // Define a ball by its note.
            throw new Error("Not implemented yet");
        }
        this.sound = sound;
        this.panner3D = panner3D;
    }

    /**
     * @param time The time in seconds.
     * @returns The position of the ball at that given time.
     */
    get_position(time: number): THREE.Vector3 {
        const prev_event = this.timeline.le(time).value;
        const next_event = this.timeline.gt(time).value;

        // Cases when one of the event is undefined.
        // Note : Should not happen if :
        //  - the timeline starts and ends with held events
        //  - and those events happen at +/- Infinity.

        //TODO : Rather have timeline sanitized with +/- Infinity ?
        //But that way, more error prone.
        //Have start/end special events (to make clear when begin/end ?) NO
        if (prev_event === undefined && next_event === undefined) {
            throw new Error("No event in the timeline to determine where the ball is.");
        }
        if (prev_event === undefined) {
            if (next_event!.is_caught) {
                throw new Error("Ball is caught at the beginning without being thrown.");
            }
            return next_event!.hand.get_global_position(time);
        }
        if (next_event === undefined) {
            if (prev_event.is_thrown) {
                throw new Error("Ball is thrown at the end without being caught.");
            }
            return prev_event.hand.get_global_position(time);
        }

        // Cases where both events exist.
        // Whatever the second is, we throw the ball looking at starting and ending sites.
        if (prev_event.is_thrown) {
            return Ball.get_airborne_position(
                prev_event.get_hand_global_position(),
                prev_event.time,
                next_event.get_hand_global_position(),
                next_event.time,
                time
            );
        } else {
            return prev_event.hand.get_global_position(time);
        }
    }

    static get_velocity_at_event(
        pos0: THREE.Vector3,
        t0: number,
        pos1: THREE.Vector3,
        t1: number,
        is_thrown: boolean
    ): THREE.Vector3 {
        const dt = t1 - t0;
        const v0x = (pos1.x - pos0.x) / dt;
        const v0z = (pos1.z - pos0.z) / dt;
        const v0y = (dt * GRAVITY) / 2 + (pos1.y - pos0.y) / dt;
        const throw_sign = is_thrown ? 1 : -1;
        return new THREE.Vector3(v0x, throw_sign * v0y, v0z);
    }

    static get_airborne_position(
        pos0: THREE.Vector3,
        t0: number,
        pos1: THREE.Vector3,
        t1: number,
        t: number
    ): THREE.Vector3 {
        const v0 = this.get_velocity_at_event(pos0, t0, pos1, t1, true);
        return new THREE.Vector3(
            v0.x * (t - t0) + pos0.x,
            (-GRAVITY / 2) * (t - t0) ** 2 + v0.y * (t - t0) + pos0.y,
            v0.z * (t - t0) + pos0.z
        );
    }

    static get_airborne_velocity(
        pos0: THREE.Vector3,
        t0: number,
        pos1: THREE.Vector3,
        t1: number,
        t: number
    ): THREE.Vector3 {
        const v0 = this.get_velocity_at_event(pos0, t0, pos1, t1, true);
        return new THREE.Vector3(v0.x, -GRAVITY * t + v0.y, v0.z);
    }

    /**
     * @param time The time in seconds
     * @returns The velocity of the ball at that given time.
     */
    get_velocity(time: number) {
        const prev_event = this.timeline.le(time).value;
        const next_event = this.timeline.gt(time).value;

        if (prev_event === undefined && next_event === undefined) {
            throw new Error("No event in the timeline to determine where the ball is.");
        }
        if (prev_event === undefined) {
            if (next_event!.is_caught) {
                throw new Error("Ball is caught at the beginning without being thrown.");
            }
            return next_event!.hand.get_global_velocity(time);
        }
        if (next_event === undefined) {
            if (prev_event.is_thrown) {
                throw new Error("Ball is thrown at the end without being caught.");
            }
            return prev_event.hand.get_global_velocity(time);
        }

        // Cases where both events exist.
        if (prev_event.is_thrown) {
            return Ball.get_airborne_velocity(
                prev_event.get_hand_global_position(),
                prev_event.time,
                next_event.get_hand_global_position(),
                next_event.time,
                time
            );
        } else {
            return prev_event.hand.get_global_velocity(time);
        }
    }

    //TODO : make it so that event.sound if array or undefined in constructor ?
    play_on_catch(time: number): void {
        const prev_event = this.timeline.le(time).value;
        if (prev_event !== undefined && this.prev_time < prev_event.time) {
            // Play a sound
            if (this.sound instanceof Tone.Players) {
                if (prev_event.sound_name !== undefined) {
                    const sound_name = prev_event.random_sound_name();
                    this.sound.player(sound_name).start();
                }
            } else if (this.sound instanceof Tone.Player) {
                this.sound.start();
            }
        }
        this.prev_time = time;
    }

    /**
     * Updates the ball's position.
     * @param time Time of the frame to render in seconds.
     */
    render = (time: number): void => {
        //Receives the time in seconds.
        const position = this.get_position(time);
        this.mesh.position.copy(position);
        this.panner3D?.setPosition(position.x, position.y, position.z);
    };

    /**
     * Properly deletes the 3D resources. Call when instance is not needed anymore to free ressources.
     */
    //TODO: Delete audio nodes too.
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export { Ball };
