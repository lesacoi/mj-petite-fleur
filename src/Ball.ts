import * as THREE from "three";
import { createRBTree, RBTree } from "./RBTree";
import { Hand } from "./Hand";
import { GRAVITY } from "./constants";
import { ThrowEvent, CatchEvent } from "./Timeline";

// function create_audio(note_name: string): HTMLAudioElement {
//     throw new Error("Not implemented");
// }

//TODO : Fusionner les évènements de main et de balles ?

type AirborneEvent = {
    status: "AIRBORNE";
    time: number;
    hand: Hand;
    //siteswap_height: number;
    destination_hand: Hand;
};

type HeldEvent = {
    status: "HELD";
    time: number;
    hand: Hand;
};

class Ball {
    color: number;
    radius: number;
    geometry: THREE.BufferGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    //sound: HTMLAudioElement | undefined = undefined;
    timeline: RBTree<number, AirborneEvent | HeldEvent>;

    constructor(
        color: number,
        radius: number,
        timeline?: RBTree<number, AirborneEvent | HeldEvent>
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
        //Have start/end special events (to make clear when begin/end ?)
        if (prev_event === undefined && next_event === undefined) {
            throw new Error("No event in the timeline.");
        }
        // if (prev_event === undefined || next_event === undefined) {
        //     let hand: Hand;
        //     if (prev_event === undefined) {
        //         hand = next_event!.hand;
        //     } else if (prev_event.status === "AIRBORNE") {
        //         hand = prev_event.destination_hand;
        //     } else {
        //         hand = prev_event.hand;
        //     }
        //     return hand.get_position(time);
        // }
        if (prev_event === undefined) {
            return next_event!.hand.get_position(time);
        }
        if (next_event === undefined) {
            if (prev_event.status === "AIRBORNE") {
                return prev_event.destination_hand.get_position(time);
            } else {
                return prev_event.hand.get_position(time);
            }
        }

        // Cases where both events exist.
        if (prev_event.status === "AIRBORNE") {
            const source_position = prev_event.hand.get_position(prev_event.time);
            const target_position = next_event.hand.get_position(next_event.time);
            return this.get_airborne_position(
                source_position,
                prev_event.time,
                target_position,
                next_event.time,
                time
            );
        } else {
            return prev_event.hand.get_position(time);
        }
    }

    get_initial_airborne_velocity(
        pos0: THREE.Vector3,
        t0: number,
        pos1: THREE.Vector3,
        t1: number
    ): THREE.Vector3 {
        const v0x = (pos1.x - pos0.x) / (t1 - t0);
        const v0z = (pos1.z - pos0.z) / (t1 - t0);
        const v0y =
            (((t1 - t0) * GRAVITY) ** 2 - 2 * GRAVITY * (pos1.y - pos0.y)) / (2 * (t1 - t0));
        return new THREE.Vector3(v0x, v0y, v0z);
    }

    get_airborne_position(
        pos0: THREE.Vector3,
        t0: number,
        pos1: THREE.Vector3,
        t1: number,
        t: number
    ): THREE.Vector3 {
        const v0 = this.get_initial_airborne_velocity(pos0, t0, pos1, t1);
        return new THREE.Vector3(
            v0.x * (t - t0) + pos0.x,
            (-GRAVITY / 2) * (t - t0) ** 2 + v0.y * (t - t0) + pos0.y,
            v0.z * (t - t0) + pos0.z
        );
    }

    get_airborne_velocity(
        pos0: THREE.Vector3,
        t0: number,
        pos1: THREE.Vector3,
        t1: number,
        t: number
    ): THREE.Vector3 {
        const v0 = this.get_initial_airborne_velocity(pos0, t0, pos1, t1);
        return new THREE.Vector3(v0.x, -GRAVITY * t + v0.y, v0.z);
    }

    get_velocity(time: number) {
        const prev_event = this.timeline.le(time).value;
        const next_event = this.timeline.gt(time).value;

        if (prev_event === undefined && next_event === undefined) {
            throw new Error("No event in the timeline.");
        }
        if (prev_event === undefined) {
            return next_event!.hand.get_velocity(time);
        }
        if (next_event === undefined) {
            if (prev_event.status === "AIRBORNE") {
                return prev_event.destination_hand.get_velocity(time);
            } else {
                return prev_event.hand.get_velocity(time);
            }
        }

        // Cases where both events exist.
        if (prev_event.status === "AIRBORNE") {
            const source_position = prev_event.hand.get_position(prev_event.time);
            const target_position = next_event.hand.get_position(next_event.time);
            return this.get_airborne_velocity(
                source_position,
                prev_event.time,
                target_position,
                next_event.time,
                time
            );
        } else {
            return prev_event.hand.get_velocity(time);
        }
    }

    /**
     * Properly deletes the 3D resources. Call when instance is not needed anymore to free ressources.
     */
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export { Ball };
