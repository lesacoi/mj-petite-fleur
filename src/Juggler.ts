import * as THREE from "three";
import { Hand, HandPhysicsHandling } from "./Hand";
import { Object3DHelper } from "./Object3DHelper";
import { find_elbow } from "./utils";

type GeoMatMesh = {
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh;
};

type JugglerMesh = {
    head: GeoMatMesh;
    chest: GeoMatMesh;
    right_arm: GeoMatMesh;
    right_elbow: GeoMatMesh;
    right_forearm: GeoMatMesh;
    right_hand: GeoMatMesh;
    left_arm: GeoMatMesh;
    left_elbow: GeoMatMesh;
    left_forearm: GeoMatMesh;
    left_hand: GeoMatMesh;
    right_leg: GeoMatMesh;
    left_leg: GeoMatMesh;
};

class Juggler {
    height: number;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh;
    readonly hands: [Hand, Hand];
    readonly right_hand: Hand;
    readonly left_hand: Hand;
    juggling_origin: THREE.Object3D;
    shoulder: THREE.Object3D;
    elbow: THREE.Object3D;
    arm_length: number;
    target: THREE.Object3D;

    constructor(height = 1.8, width = 0.3, depth = 0.5, arm_length = 0.4) {
        this.height = height;
        this.arm_length = arm_length;
        const basic_geometry = new THREE.BoxGeometry(width, height, depth);
        //this.geometry = new THREE.EdgesGeometry(basic_geometry);
        //this.material = new THREE.LineBasicMaterial({ color: "black", linewidth: 2 });
        basic_geometry.translate(0, height / 2, 0);
        this.geometry = basic_geometry;
        this.material = new THREE.MeshPhongMaterial({ color: "yellow", wireframe: true });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        //this.wireframe = new THREE.LineSegments(this.geometry, this.material);
        //this.mesh.translateY(height / 2);
        this.juggling_origin = new THREE.Object3D();
        const hand_physics_handling: HandPhysicsHandling = {
            min_dist: 0.05,
            max_dist: depth / 2,
            up_vector: new THREE.Vector3(0, 1, 0),
            right_vector: new THREE.Vector3(0, 0, 1),
            origin_object: this.juggling_origin
        };
        this.right_hand = new Hand(hand_physics_handling, true);
        this.left_hand = new Hand(hand_physics_handling, false);
        this.hands = [this.right_hand, this.left_hand];

        this.juggling_origin.add(new Object3DHelper());
        this.juggling_origin.position.set(arm_length, height - 0.4 - arm_length, 0);

        this.mesh.add(this.juggling_origin);
        this.juggling_origin.add(this.hands[0].mesh);
        this.juggling_origin.add(this.hands[1].mesh);

        this.shoulder = new THREE.Object3D();
        this.shoulder.position.set(0, height - 0.4, depth / 2);
        this.mesh.add(this.shoulder);
        this.shoulder.add(new Object3DHelper());

        this.elbow = new THREE.Object3D();
        this.elbow.position.set(0, 0, 0);
        this.mesh.add(this.elbow);
        this.elbow.add(new Object3DHelper());

        this.target = new THREE.Object3D();
        this.target.position.set(0, 0, depth / 2);
        this.mesh.add(this.target);
        this.target.add(new Object3DHelper());
    }

    render = (time: number): void => {
        //Receives the time in seconds.
        this.hands[0].render(time);
        this.hands[1].render(time);
        this.elbow.position.copy(
            find_elbow(
                this.shoulder.position,
                this.mesh.worldToLocal(this.right_hand.get_global_position(time)),
                this.arm_length,
                this.arm_length,
                this.target.position
            )
        );
    };
}

export { Juggler };
