import * as THREE from "three";
import { VECTOR3_STRUCTURE } from "./constants";
import { createRBTree, RBTree } from "./RBTree";
import { CubicHermiteSpline } from "./Spline";
import { JugglingEvent } from "./Timeline";

//TODO : Change the fact that all methods have get in front of them

const { add: V3ADD, multiply_by_scalar: V3SCA } = VECTOR3_STRUCTURE;

type HandPhysicsHandling = {
    min_dist: number;
    max_dist: number;
    is_right_hand: boolean;
    up_vector: THREE.Vector3;
    right_vector: THREE.Vector3;
};

class Hand {
    //juggler: Juggler;
    geometry: THREE.BufferGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    timeline: RBTree<number, JugglingEvent>;
    min_dist: number;
    max_dist: number;
    is_right_hand: boolean;
    up_vector: THREE.Vector3;
    right_vector: THREE.Vector3;

    // Constructs hand ONLY FROM THE JUGGLING PANE ORIGIN
    constructor(
        hand_physics_handling: HandPhysicsHandling,
        timeline?: RBTree<number, JugglingEvent>
    ) {
        this.geometry = new THREE.SphereGeometry(0.1, 8, 4);
        this.material = new THREE.MeshPhongMaterial({ color: "black" });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        if (timeline === undefined) {
            this.timeline = createRBTree();
        } else {
            this.timeline = structuredClone(timeline);
        }
        this.min_dist = hand_physics_handling.min_dist;
        this.max_dist = hand_physics_handling.max_dist;
        this.is_right_hand = hand_physics_handling.is_right_hand;
        this.up_vector = hand_physics_handling.up_vector;
        this.right_vector = hand_physics_handling.right_vector;
    }

    get_rest_position(unit_time: number): THREE.Vector3 {
        const t0 = 0.4;
        const alpha = 9 / 10;
        const distance =
            this.max_dist + (1 - alpha) ** (-unit_time / t0) * (this.max_dist - this.min_dist);
        const hand_sign = this.is_right_hand ? 1 : -1;
        return V3SCA(hand_sign * distance, this.right_vector);
    }

    get_default_rest_position(): THREE.Vector3 {
        const hand_sign = this.is_right_hand ? 1 : -1;
        return V3SCA(hand_sign * this.max_dist, this.right_vector);
    }

    get_rest_site_offset(
        unit_time: number,
        is_thrown: boolean,
        rest_position?: THREE.Vector3
    ): THREE.Vector3 {
        if (rest_position === undefined) {
            rest_position = this.get_rest_position(unit_time);
        }
        const throw_sign = is_thrown ? -1 : 1;
        return V3SCA(throw_sign * (1 / 3), rest_position);
    }

    get_site_position(unit_time: number, is_thrown: boolean): THREE.Vector3 {
        const rest_position = this.get_rest_position(unit_time);
        const rest_site_offset = this.get_rest_site_offset(unit_time, is_thrown, rest_position);
        return V3ADD(rest_position, rest_site_offset);
    }

    private get_spline(
        prev_event: JugglingEvent | undefined,
        next_event: JugglingEvent | undefined
    ): CubicHermiteSpline<THREE.Vector3> {
        let points: THREE.Vector3[], dpoints: THREE.Vector3[], knots: number[];
        if (prev_event === undefined && next_event === undefined) {
            points = [this.get_default_rest_position()];
            dpoints = [new THREE.Vector3(0, 0, 0)];
            knots = [0];
        } else if (prev_event === undefined) {
            points = [
                this.get_rest_position(next_event!.unit_time),
                this.get_site_position(next_event!.unit_time, next_event!.is_thrown)
            ];
            dpoints = [new THREE.Vector3(0, 0, 0), next_event!.get_ball_velocity()];
            knots = [next_event!.time - next_event!.unit_time, next_event!.time];
        } else if (next_event === undefined) {
            points = [
                this.get_site_position(prev_event.unit_time, prev_event.is_thrown),
                this.get_rest_position(prev_event.unit_time)
            ];
            dpoints = [prev_event.get_ball_velocity(), new THREE.Vector3(0, 0, 0)];
            knots = [prev_event.time, prev_event.time + prev_event.unit_time];
        } else {
            points = [
                this.get_site_position(prev_event.unit_time, prev_event.is_thrown),
                this.get_site_position(next_event.unit_time, next_event.is_thrown)
            ];
            dpoints = [prev_event.get_ball_velocity(), next_event.get_ball_velocity()];
            knots = [prev_event.time, next_event.time];
        }
        // TODO : Add a little bit of impact based on speed after throw / catch. Ou quand la ball sonne et qu'on la claque dans la main.
        return new CubicHermiteSpline(VECTOR3_STRUCTURE, points, dpoints, knots);
    }

    get_position(time: number): THREE.Vector3 {
        const prev_event = this.timeline.le(time).value;
        const next_event = this.timeline.gt(time).value;
        const spline = this.get_spline(prev_event, next_event);
        return spline.interpolate(time);
    }

    get_velocity(time: number): THREE.Vector3 {
        const prev_event = this.timeline.le(time).value;
        const next_event = this.timeline.gt(time).value;
        const spline = this.get_spline(prev_event, next_event);
        return spline.velocity(time);
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
