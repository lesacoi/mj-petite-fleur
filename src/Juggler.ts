import * as THREE from "three";
import { Hand, HandPhysicsHandling } from "./Hand";

class Juggler {
    height: number;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh;
    hands: [Hand, Hand];
    juggling_origin: THREE.Object3D;

    constructor(height = 1.8, width = 0.5, depth = 0.3, arm_length = 0.4) {
        this.height = height;
        const basic_geometry = new THREE.BoxGeometry(width, height, depth, 1, 1, 1);
        this.geometry = new THREE.EdgesGeometry(basic_geometry);
        this.material = new THREE.LineBasicMaterial({ color: "black", linewidth: 2 });
        this.mesh = new THREE.Mesh();
        const hand_physics_handling: HandPhysicsHandling = {
            min_dist: 0.05,
            max_dist: width,
            up_vector: new THREE.Vector3(0, 1, 0),
            right_vector: new THREE.Vector3(1, 0, 0)
        };
        this.hands = [
            new Hand(hand_physics_handling, true),
            new Hand(hand_physics_handling, false)
        ];

        this.juggling_origin = new THREE.Object3D();
        this.juggling_origin.position.set(arm_length, 0, 0);

        this.mesh.add(this.juggling_origin);
        this.juggling_origin.add(this.hands[0].mesh);
        this.juggling_origin.add(this.hands[1].mesh);
    }

    render = (time: number): void => {
        //Receives the time in seconds.
        this.hands[0].render(time);
        this.hands[1].render(time);
    };
}

export { Juggler };
