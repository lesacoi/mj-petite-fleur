import * as THREE from "three";
import { VECTOR3_STRUCTURE } from "./constants";
import { createRBTree, RBTree } from "./RBTree";
import { CubicHermiteSpline, QuinticHermiteSpline } from "./Spline";
import { JugglingEvent } from "./Timeline";

//TODO : Change the fact that all methods have get in front of them

const { add: V3ADD, multiply_by_scalar: V3SCA } = VECTOR3_STRUCTURE;

export type HandPhysicsHandling = {
    min_dist: number;
    max_dist: number;
    up_vector: THREE.Vector3;
    right_vector: THREE.Vector3;
    origin_object: THREE.Object3D;
};

class Hand {
    //juggler: Juggler;
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh;
    timeline: RBTree<number, JugglingEvent>;
    readonly min_dist: number;
    readonly max_dist: number;
    readonly is_right_hand: boolean;
    readonly up_vector: THREE.Vector3;
    readonly right_vector: THREE.Vector3;
    readonly origin_object: THREE.Object3D;

    // Constructs hand ONLY FROM THE JUGGLING PANE ORIGIN
    constructor(
        hand_physics_handling: HandPhysicsHandling,
        is_right_hand: boolean,
        timeline?: RBTree<number, JugglingEvent>
    ) {
        this.geometry = new THREE.SphereGeometry(0.05, 8, 4);
        this.material = new THREE.MeshPhongMaterial({ color: "black" });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        // this.mesh.visible = false;
        if (timeline === undefined) {
            this.timeline = createRBTree();
        } else {
            this.timeline = structuredClone(timeline);
        }
        this.min_dist = hand_physics_handling.min_dist;
        this.max_dist = hand_physics_handling.max_dist;
        this.is_right_hand = is_right_hand;
        this.up_vector = hand_physics_handling.up_vector;
        this.right_vector = hand_physics_handling.right_vector;
        this.origin_object = hand_physics_handling.origin_object;
    }

    get_rest_position(unit_time: number): THREE.Vector3 {
        const t0 = 0.4;
        const alpha = 9 / 10;
        const distance =
            this.min_dist + alpha ** (t0 / unit_time) * (this.max_dist - this.min_dist);
        const hand_sign = this.is_right_hand ? 1 : -1;
        return V3SCA(hand_sign * distance, this.right_vector);
    }

    get_default_rest_position(): THREE.Vector3 {
        const hand_sign = this.is_right_hand ? 1 : -1;
        return V3SCA(hand_sign * this.max_dist, this.right_vector);
    }

    //TODO : Mettre des object3D qui s'updatent pour les rest/throw/catch sites ?
    //Histoire de pouvoir les visualiser.
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

    get_midpoint_up(unit_time: number) {
        const rest_position = this.get_rest_position(unit_time);
        return V3ADD(rest_position, V3SCA((1 / 3) * rest_position.length(), this.up_vector));
    }

    world_to_local_velocity(vec: THREE.Vector3) {
        return this.mesh.worldToLocal(vec).sub(this.mesh.worldToLocal(new THREE.Vector3(0, 0, 0)));
    }

    get_spline(
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
            dpoints = [
                new THREE.Vector3(0, 0, 0),
                this.world_to_local_velocity(next_event!.get_ball_velocity())
            ];
            knots = [next_event!.time - next_event!.unit_time, next_event!.time];
        } else if (next_event === undefined) {
            points = [
                this.get_site_position(prev_event.unit_time, prev_event.is_thrown),
                this.get_rest_position(prev_event.unit_time)
            ];
            dpoints = [
                this.world_to_local_velocity(prev_event.get_ball_velocity()),
                new THREE.Vector3(0, 0, 0)
            ];
            knots = [prev_event.time, prev_event.time + prev_event.unit_time];
        } else if (prev_event.hand_status === "THROW") {
            points = [
                this.get_site_position(prev_event.unit_time, prev_event.is_thrown),
                this.get_site_position(next_event.unit_time, next_event.is_thrown)
            ];
            dpoints = [
                V3SCA(1, this.world_to_local_velocity(prev_event.get_ball_velocity())),
                V3SCA(1 / 3, this.world_to_local_velocity(next_event.get_ball_velocity()))
            ];
            knots = [prev_event.time, next_event.time];
        } else {
            points = [
                this.get_site_position(prev_event.unit_time, prev_event.is_thrown),
                this.get_site_position(next_event.unit_time, next_event.is_thrown)
            ];
            dpoints = [
                V3SCA(1 / 3, this.world_to_local_velocity(prev_event.get_ball_velocity())),
                V3SCA(1, this.world_to_local_velocity(next_event.get_ball_velocity()))
            ];
            knots = [prev_event.time, next_event.time];
        }
        // TODO : Add a little bit of impact based on speed after throw / catch. Ou quand la ball sonne et qu'on la claque dans la main.
        return new CubicHermiteSpline(VECTOR3_STRUCTURE, points, dpoints, knots);
    }

    get_local_position(time: number): THREE.Vector3 {
        const prev_event = this.timeline.le(time).value;
        const next_event = this.timeline.gt(time).value;
        const spline = this.get_spline(prev_event, next_event);
        return spline.interpolate(time);
    }

    //TODO : Pas ouf que _origin_object soit utilisé ici. Changer la classe ?
    //Faire uniquement avec mesh en faisant offset ?
    //Note : suppose que le jongleur ne bouge pas.
    get_global_position(time: number): THREE.Vector3 {
        return this.origin_object.localToWorld(this.get_local_position(time));
    }

    get_local_velocity(time: number): THREE.Vector3 {
        const prev_event = this.timeline.le(time).value;
        const next_event = this.timeline.gt(time).value;
        const spline = this.get_spline(prev_event, next_event);
        return spline.velocity(time);
    }

    get_global_velocity(time: number): THREE.Vector3 {
        const vec = this.get_local_velocity(time);
        return this.mesh.localToWorld(vec).sub(this.mesh.localToWorld(new THREE.Vector3(0, 0, 0)));
    }

    render = (time: number): void => {
        this.mesh.position.copy(this.get_local_position(time));
    };

    /**
     * Properly deletes the 3D resources. Call when instance is not needed anymore to free ressources.
     */
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export { Hand };
