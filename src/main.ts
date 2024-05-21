import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Object3DHelper } from "./Object3DHelper";
import createRBTree from "functional-red-black-tree";
import { create, all } from "mathjs";

const math = create(all, {});

const canvas = document.querySelector("#simulator_canvas")!;
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
//NOT RECOMMENDED
//renderer.setPixelRatio(window.devicePixelRatio);
//console.log(`window.devicePixelRatio = ${window.devicePixelRatio}`);

const aspect = canvas.clientWidth / canvas.clientHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 50);

const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-1, 2, 5);
controls.target.set(0, 0, 0);
controls.update();

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x555555);
const axes_helper = new THREE.AxesHelper(1.5);
axes_helper.position.y = 0.001;
scene.add(axes_helper);
const grid_helper = new THREE.GridHelper(30, 30);
scene.add(grid_helper);

const ambient_light = new THREE.AmbientLight(scene.background, 2);
scene.add(ambient_light);
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

function create_juggler_mesh() {
    const geometry = new THREE.CapsuleGeometry(0.5, 1.8);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const juggler_mesh = new THREE.Mesh(geometry, material);
    return juggler_mesh;
}

const juggler_mesh = create_juggler_mesh();
juggler_mesh.position.set(0, 0.9, 0);
scene.add(juggler_mesh);
const siteswap_unit_time = 0.5;
const throw_height = 3;
const dwell_time = 0.5;

class BallEvent {
    start_time: number;
    end_time: number;
    constructor(start_time: number, end_time: number) {
        this.start_time = start_time;
        this.end_time = end_time;
    }
    get_position(t: number) {
        throw new Error("Must be overriden by children classes.");
    }
}
class Held extends BallEvent {
    hand: number;
    constructor(start_time: number, end_time: number, hand: number) {
        super(start_time, end_time);
        this.hand = hand;
    }
    get_position(t: number) {
        return t;
    }
}
class Airborne extends BallEvent {
    siteswap_height: number;
    hand0: number;
    hand1: number;
    constructor(start_time: number, end_time: number, hand0: number, hand1: number) {
        super(start_time, end_time);
        this.siteswap_height = 3;
        this.hand0 = hand0;
        this.hand1 = hand1;
    }
}

/**
 * Multiplies a matrix of scalars by a vector of matrices.
 * @param A a matrix of scalars (numbers).
 * @param B an array of matrices.
 * @returns
 */
function multiply_matrix_of_scalars_by_vector_of_matrices(
    A: math.Matrix,
    B: math.Matrix[]
): math.Matrix[] {
    if (A.size()[1] !== B.length) {
        throw new Error("Incompatible multiplication sizes.");
    }
    const C: math.Matrix[] = [];
    for (let i = 0; i < A.size()[0]; i++) {
        let coeff = math.matrix(math.zeros(B[0].size()));
        for (let j = 0; j < B.length; j++) {
            coeff = math.add(coeff, math.multiply(A.get([i, j]), B[j]));
        }
        C.push(coeff);
    }
    return C;
}

/**
 * Interpolates the non uniform cubic hermite spline given the following :
 * @param pos0 the initial value.
 * @param dpos0 the velocity at that first value.
 * @param t0 the time at that first value.
 * @param pos1 the final value.
 * @param dpos1 the velocity at that final value.
 * @param t1 the time at that final value.
 * @param t the time (between t0 and t1) to interpolate.
 * @returns the interpolated value.
 */
function cubic_hermite_spline(
    pos0: math.Matrix,
    dpos0: math.Matrix,
    t0: number,
    pos1: math.Matrix,
    dpos1: math.Matrix,
    t1: number,
    t: number
): math.Matrix {
    const dt = t1 - t0;
    const mat = math.matrix([
        [2, -2, dt, dt],
        [-3, 3, -2 * dt, dt],
        [0, 0, 1, 0],
        [1, 0, 0, 0]
    ]);
    const params_mat = [pos0, pos1, dpos0, dpos1];
    const t_nor = (t - t0) / (t1 - t0);
    const times_mat = math.matrix([t_nor ** 3, t_nor ** 2, t_nor ** 1, t_nor ** 0]);
    return multiply_matrix_of_scalars_by_vector_of_matrices(
        math.multiply(times_mat, mat),
        params_mat
    )[0];
}

function three_vector3_to_matjs_matrix(vec: THREE.Vector3Like): math.Matrix {
    return math.matrix([vec.x, vec.y, vec.z]);
}

function matjs_matrix_to_three_vector3(mat: math.Matrix): THREE.Vector3 {
    return new THREE.Vector3(
        mat.get([0]) as number,
        mat.get([1]) as number,
        mat.get([2]) as number
    );
}

interface EventData {
    pos: THREE.Vector3;
    dpos: THREE.Vector3;
    time: number;
}

type RBTree<K, V> = createRBTree.Tree<K, V>;

const ball_events: RBTree<number, any>[] = [];
const nb_balls = 3;
for (let i = 0; i < nb_balls; i++) {
    ball_events.push(createRBTree());
}
const hand_events: RBTree<number, EventData>[] = [];
const nb_hands = 2;
for (let i = 0; i < nb_hands; i++) {
    hand_events.push(createRBTree());
}

/*
function create_hand_events(
    pattern: string,
    dwell_time: number,
    siteswap_unit_time: number,
    nb_hands: number,
    balls_init_config: 
): RBTree<number, EventData>[] {
    const hand_events: RBTree<number, EventData>[] = [];
}*/

// Rename to "positon" ?
//TODO : Test if INFINITY causes a problem...
function get_hand_position(hand_idx: number, time: number): THREE.Vector3 {
    const iter_before = hand_events[hand_idx].le(time);
    const t0 = iter_before.key!;
    const { pos: pos0, dpos: dpos0 } = iter_before.value!;
    const iter_after = hand_events[hand_idx].le(time);
    const t1 = iter_after.key!;
    const { pos: pos1, dpos: dpos1 } = iter_after.value!;
    return matjs_matrix_to_three_vector3(
        cubic_hermite_spline(
            three_vector3_to_matjs_matrix(pos0),
            three_vector3_to_matjs_matrix(dpos0),
            t0,
            three_vector3_to_matjs_matrix(pos1),
            three_vector3_to_matjs_matrix(dpos1),
            t1,
            time
        )
    );
}

const g = 9.81;

function get_airborne_ball_position(
    pos0: THREE.Vector3,
    t0: number,
    pos1: THREE.Vector3,
    t1: number,
    t: number
): THREE.Vector3 {
    const v0x = (pos1.x - pos0.x) / (t1 - t0);
    const v0z = (pos1.z - pos0.z) / (t1 - t0);
    const v0y = (((t1 - t0) * g) ** 2 - 2 * g * (pos1.y - pos0.y)) / (2 * (t1 - t0));
    const v0 = new THREE.Vector3(v0x, v0y, v0z);
    return new THREE.Vector3(
        v0.x * (t - t0) + pos0.x,
        (-g / 2) * (t - t0) ** 2 + v0.y * (t - t0) + pos0.y,
        v0.z * (t - t0) + pos0.z
    );
}

function get_held_ball_position(hand_idx: number, t: number): THREE.Vector3 {
    return get_hand_position(hand_idx, t);
}

//TODO : Looping mode and non looping mode ?
// To be able to juggle non musical things ?
function get_ball_position(ball, ball_idx, time) {
    const iter_before = ball_events[ball_idx].le(time);
    const t0 = iter_before.key!;
    const { pos: pos0, dpos: dpos0 } = iter_before.value!;
    const iter_after = hand_events[hand_idx].le(time);
    const t1 = iter_after.key!;
    const { pos: pos1, dpos: dpos1 } = iter_after.value!;
    if (ball.status === "AIRBORNE") {
        //get_airborne_ball_position();
    } else if (ball.status === "IN_HAND") {
        //get_held_ball_position();
    } else if (ball.status === "ON_TABLE") {
        throw new Error("Table Not Implemented yet.");
    } else {
        throw new Error("Status not understood.");
    }
}

const obj_test = new THREE.Object3D();
scene.add(obj_test);
obj_test.add(new Object3DHelper());
obj_test.position.set(0, 3, 0);

{
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
}

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

function makeInstance(geometry: THREE.BoxGeometry, color: number, x: number) {
    const material = new THREE.MeshPhongMaterial({ color });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.add(new THREE.AxesHelper());

    cube.position.x = x;

    return cube;
}

const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, -2),
    makeInstance(geometry, 0xaa8844, 2)
];

function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = Math.floor(canvas.clientWidth * pixelRatio);
    const height = Math.floor(canvas.clientHeight * pixelRatio);
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    return needResize;
}

function render(time: number) {
    time *= 0.001; // convert time to seconds

    resizeRendererToDisplaySize(renderer);

    cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * 0.1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);
