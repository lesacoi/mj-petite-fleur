import * as THREE from "three";
import { createRBTree, RBTree } from "./RBTree";
import { Hand } from "./Hand";
import { GRAVITY } from "./constants";

// function create_audio(note_name: string): HTMLAudioElement {
//     throw new Error("Not implemented");
// }

type AirborneEvent = {
    status: "AIRBORNE";
    time: number;
    hand: Hand;
    siteswap_height: number;
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
        if (prev_event === undefined && next_event === undefined) {
            throw new Error("No event in the timeline.");
        }
        if (prev_event === undefined) {
            return next_event!.hand.get_position(time);
        }
        if (next_event === undefined) {
            if (prev_event.status === "AIRBORNE") {
                //TODO : Change that (include dest hand in the airborne event ?)
                throw new Error("No destination hand specified for the last throw.");
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

    get_airborne_position(
        pos0: THREE.Vector3,
        t0: number,
        pos1: THREE.Vector3,
        t1: number,
        t: number
    ): THREE.Vector3 {
        const v0x = (pos1.x - pos0.x) / (t1 - t0);
        const v0z = (pos1.z - pos0.z) / (t1 - t0);
        const v0y =
            (((t1 - t0) * GRAVITY) ** 2 - 2 * GRAVITY * (pos1.y - pos0.y)) / (2 * (t1 - t0));
        const v0 = new THREE.Vector3(v0x, v0y, v0z);
        return new THREE.Vector3(
            v0.x * (t - t0) + pos0.x,
            (-GRAVITY / 2) * (t - t0) ** 2 + v0.y * (t - t0) + pos0.y,
            v0.z * (t - t0) + pos0.z
        );
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
