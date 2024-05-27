import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Object3DHelper } from "./Object3DHelper";
import createRBTree from "functional-red-black-tree";

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

type EventData = {
    pos: THREE.Vector3;
    dpos: THREE.Vector3;
    time: number;
};

jugglers_origin: THREE.Vector3;
min_distance_to_origin: THREE.Vector3;
max_distance_to_origin: THREE.Vector3;
arm_length: number;
forearm_length: number;
distance_to_juggling_plane: number;



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

    /*
    hands.forEach((hand, hand_idx) => {
        hand.position.set(get_hand_position(t, hand_idx))
    })
    balls.forEach((ball, ball_idx) => {
        ball.position.set(get_ball_position(t, ball_idx))
    })
    */
}

requestAnimationFrame(render);
