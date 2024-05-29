import * as THREE from "three";
import { createRBTree, RBTree } from "./RBTree";
import { CubicHermiteSpline } from "./Spline";
import { GRAVITY, VECTOR3_STRUCTURE } from "./constants";
import { ThrowEvent, CatchEvent } from "./Timeline";

// TODO : Avoiding circular references is a mess...
// It makes it so this.throw_to_catch_event has to be called from the hand where the event happens else it leads to nonsense...
// Cleaner to have catch/throwevents weakly reference each other ?
// Create custom weakref to be simpler ?

//TODO : Change the fact that all methods have get in front of them

const { multiply_by_scalar: V3SCA } = VECTOR3_STRUCTURE;

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
    timeline: RBTree<number, ThrowEvent | CatchEvent>;
    min_dist: number;
    max_dist: number;
    is_right_hand: boolean;
    up_vector: THREE.Vector3;
    right_vector: THREE.Vector3;

    // Constructs hand ONLY FROM THE JUGGLING PANE ORIGIN
    constructor(
        hand_physics_handling: HandPhysicsHandling,
        timeline?: RBTree<number, ThrowEvent | CatchEvent>
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

    get_catch_throw_position(
        event: ThrowEvent | CatchEvent,
        rest_position: THREE.Vector3
    ): THREE.Vector3 {
        const throw_sign = event instanceof ThrowEvent ? -1 : 1;
        return V3SCA(1 + throw_sign * (1 / 3), rest_position);
    }

    get_ball_event_position(event: ThrowEvent | CatchEvent): THREE.Vector3 {
        const rest_position = this.get_rest_position(event.unit_time);
        const event_position = this.get_catch_throw_position(event, rest_position);
        return event_position;
    }

    get_ball_event_velocity(event: ThrowEvent | CatchEvent): THREE.Vector3 {
        let throw_pos: THREE.Vector3, catch_pos: THREE.Vector3;
        let thrown_sign: number;
        let flight_time: number;
        if (event instanceof ThrowEvent) {
            throw_pos = this.get_ball_event_position(event);
            //TODO Move method to clean this line ?
            catch_pos = event.catch_event.hand.get_ball_event_position(event.catch_event);
            flight_time = event.catch_event.time - event.time;
            thrown_sign = 1;
        } else {
            catch_pos = this.get_ball_event_position(event);
            throw_pos = event.throw_event.hand.get_ball_event_position(event.throw_event);
            flight_time = event.time - event.throw_event.time;
            thrown_sign = -1;
        }
        return new THREE.Vector3(
            (catch_pos.x - throw_pos.x) / flight_time,
            (thrown_sign * (flight_time * GRAVITY) ** 2 +
                2 * GRAVITY * (catch_pos.y - throw_pos.y)) /
                (2 * flight_time),
            (catch_pos.z - throw_pos.z) / flight_time
        );
    }

    get_position(time: number): THREE.Vector3 {
        const prev_event = this.timeline.le(time).value;
        const next_event = this.timeline.gt(time).value;

        if (prev_event === undefined && next_event === undefined) {
            return this.get_default_rest_position();
        }
        if (prev_event === undefined) {
            const points = [
                this.get_default_rest_position,
                this.get_ball_event_position(next_event)
            ];
            const dpoints = [new THREE.Vector3(0, 0, 0), this.get_ball_event_velocity(next_event!)];
            const knots = [next_event!.time - next_event!.unit_time, next_event!.time];
        }
        if (next_event === undefined) {
            throw new Error("TODO.");
        }
        // TODO : Add a little bit of impact based on speed after throw / catch. Ou quand la ball sonne et qu'on la claque dans la main.
        const points = [
            this.get_ball_event_position(prev_event),
            this.get_ball_event_position(next_event)
        ];
        const dpoints = [
            this.get_ball_event_velocity(prev_event),
            this.get_ball_event_velocity(next_event)
        ];
        const knots = [prev_event.time, next_event.time];
        const spline = new CubicHermiteSpline(VECTOR3_STRUCTURE, points, dpoints, knots);
        return spline.interpolate(time);
    }

    get_velocity(time: number): THREE.Vector3 {
        return new THREE.Vector3(0, 0, 0);
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
