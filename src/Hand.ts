import * as THREE from "three";
import { createRBTree, RBTree } from "./RBTree";
import { Ball } from "./Ball";
import { CubicHermiteSpline } from "./Spline";
import { GRAVITY, VECTOR3_STRUCTURE } from "./constants";
//import { Juggler } from "./Juggler";

const { add: V3ADD, multiply_by_scalar: V3SCA } = VECTOR3_STRUCTURE;

type CatchEvent = {
    status: "CATCH";
    time: number;
    ball: Ball;
    unit_time: number;
    throw_time: number;
    throw_hand: Hand;
    throw_unit_time: number;
};

type ThrowEvent = {
    status: "THROW";
    time: number;
    ball: Ball;
    unit_time: number;
    catch_time: number;
    catch_hand: Hand;
    catch_unit_time: number;
};

type HandPhysicsHandling = {
    min_dist: number;
    max_dist: number;
    is_right_hand: boolean;
    juggler_origin: THREE.Vector3;
    up_vector: THREE.Vector3;
    right_vector: THREE.Vector3;
};

class Hand {
    //juggler: Juggler;
    geometry: THREE.BufferGeometry;
    material: THREE.MeshPhongMaterial;
    mesh: THREE.Mesh;
    timeline: RBTree<number, CatchEvent | ThrowEvent>;
    min_dist: number;
    max_dist: number;
    is_right_hand: boolean;
    juggler_origin: THREE.Vector3;
    up_vector: THREE.Vector3;
    right_vector: THREE.Vector3;

    constructor(
        hand_physics_handling: HandPhysicsHandling,
        timeline?: RBTree<number, CatchEvent | ThrowEvent>
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
        this.juggler_origin = hand_physics_handling.juggler_origin;
        this.up_vector = hand_physics_handling.up_vector;
        this.right_vector = hand_physics_handling.right_vector;
    }

    get_rest_origin_distance(unit_time: number): number {
        const t0 = 0.4;
        const alpha = 9 / 10;
        return this.max_dist + (1 - alpha) ** (-unit_time / t0) * (this.max_dist - this.min_dist);
    }

    get_throw_rest_distance(rest_origin_distance: number): number {
        return (1 / 3) * rest_origin_distance;
    }

    get_ball_event_position(event: CatchEvent | ThrowEvent): THREE.Vector3 {
        const hand_sign = this.is_right_hand ? 1 : -1;
        const throw_sign = event.status === "THROW" ? -1 : 1;
        const rest_origin_distance = this.get_rest_origin_distance(event.unit_time);
        const throw_rest_distance = this.get_throw_rest_distance(rest_origin_distance);
        const point = V3ADD(
            this.juggler_origin,
            V3SCA(
                hand_sign * (rest_origin_distance + throw_sign * throw_rest_distance),
                this.right_vector
            )
        );
        return point;
    }

    get_ball_event_velocity(event: CatchEvent | ThrowEvent): THREE.Vector3 {
        let throw_pos: THREE.Vector3, catch_pos: THREE.Vector3;
        let thrown_sign: number;
        let flight_time: number;
        if (event.status === "THROW") {
            throw_pos = this.get_ball_event_position(event);
            const catch_event: CatchEvent = {
                status: "CATCH",
                time: event.catch_time,
                ball: event.ball,
                unit_time: event.catch_unit_time,
                throw_time: event.time,
                throw_hand: this,
                throw_unit_time: event.unit_time
            };
            catch_pos = event.catch_hand.get_ball_event_position(catch_event);
            flight_time = event.catch_time - event.time;
            thrown_sign = 1;
        } else {
            catch_pos = this.get_ball_event_position(event);
            const throw_event: ThrowEvent = {
                status: "THROW",
                time: event.throw_time,
                ball: event.ball,
                unit_time: event.throw_unit_time,
                catch_time: event.time,
                catch_hand: this,
                catch_unit_time: event.unit_time
            };
            throw_pos = event.throw_hand.get_ball_event_position(throw_event);
            flight_time = event.time - event.throw_time;
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
            //REST POSITION
            throw new Error("TODO.");
        }
        if (prev_event === undefined) {
            const points = [
                //Rest position, this.get_ball_event_position(next_event)
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

    /**
     * Properly deletes the 3D resources. Call when instance is not needed anymore to free ressources.
     */
    dispose() {
        this.geometry.dispose();
        this.material.dispose();
    }
}

export { Hand };
