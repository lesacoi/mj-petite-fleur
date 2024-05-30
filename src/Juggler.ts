import * as THREE from "three";
import { Hand, HandPhysicsHandling } from "./Hand";
import { Object3DHelper } from "./Object3DHelper";

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
        //this.geometry = new THREE.EdgesGeometry(basic_geometry);
        //this.material = new THREE.LineBasicMaterial({ color: "black", linewidth: 2 });
        basic_geometry.rotateY(Math.PI / 2);
        basic_geometry.translate(0, height / 2, 0);
        this.geometry = basic_geometry;
        this.material = new THREE.MeshPhongMaterial({ color: "yellow" });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        //this.wireframe = new THREE.LineSegments(this.geometry, this.material);
        //this.mesh.translateY(height / 2);
        const hand_physics_handling: HandPhysicsHandling = {
            min_dist: 0.05,
            max_dist: width / 2,
            up_vector: new THREE.Vector3(0, 1, 0),
            right_vector: new THREE.Vector3(0, 0, 1)
        };
        this.hands = [
            new Hand(hand_physics_handling, true),
            new Hand(hand_physics_handling, false)
        ];

        this.juggling_origin = new THREE.Object3D();
        const helper = new Object3DHelper();
        this.juggling_origin.add(helper);
        this.juggling_origin.position.set(arm_length, 1.8 - 0.3 - arm_length, 0);

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
