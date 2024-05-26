import * as THREE from "three";
import { Hand } from "./Hand";

class Juggler {
    height: number;
    geometry: THREE.BufferGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    hands: [Hand, Hand];
    timeline: RBTree<number, number>;

    constructor() {}
}

export { Juggler };
