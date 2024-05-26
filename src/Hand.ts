import * as THREE from "three";
import { createRBTree, RBTree } from "./RBTree";
import { Ball } from "./Ball";
//import { Juggler } from "./Juggler";

type CatchEvent = {
    status: "CATCH";
    time: number;
    ball: Ball;
};

type ThrowEvent = {
    status: "THROW";
    time: number;
    ball: Ball;
};

class Hand {
    //juggler: Juggler;
    geometry: THREE.BufferGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    timeline: RBTree<number, CatchEvent | ThrowEvent>;

    constructor(timeline?: RBTree<number, CatchEvent | ThrowEvent>) {
        this.geometry = new THREE.SphereGeometry(0.1, 8, 4);
        this.material = new THREE.MeshPhongMaterial({ color: "black" });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        if (timeline === undefined) {
            this.timeline = createRBTree();
        } else {
            this.timeline = structuredClone(timeline);
        }
    }

    get_position(time: number): THREE.Vector3 {
        const prev_event = this.timeline.le(time).value;
        const next_event = this.timeline.gt(time).value;

        if (prev_event === undefined && next_event === undefined) return new THREE.Vector3();
    }

    /**
     * Properly deletes the 3D resources. Call when instance is not needed anymore to free ressources.
     */
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export { Hand };
