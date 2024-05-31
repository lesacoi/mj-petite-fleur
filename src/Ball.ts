import * as THREE from "three";
import { createRBTree, RBTree } from "./RBTree";
import { GRAVITY } from "./constants";
import { JugglingEvent } from "./Timeline";

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
    //sound: HTMLAudioElement | undefined = undefined;
    timeline: RBTree<number, JugglingEvent>;

    constructor(color: number | string, radius: number, timeline?: RBTree<number, JugglingEvent>) {
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
        // if (typeof sound === "string") {
        //     this.sound = create_audio(sound);
        // } else {
        //     this.sound = sound;
        // }
    }

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
            return next_event!.hand.get_velocity(time);
        }
        if (next_event === undefined) {
            if (prev_event.is_thrown) {
                throw new Error("Ball is thrown at the end without being caught.");
            }
            return prev_event.hand.get_velocity(time);
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
            return prev_event.hand.get_velocity(time);
        }
    }

    render = (time: number): void => {
        //Receives the time in seconds.
        this.mesh.position.copy(this.get_position(time));
    };

    /**
     * Properly deletes the 3D resources. Call when instance is not needed anymore to free ressources.
     */
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export { Ball };
