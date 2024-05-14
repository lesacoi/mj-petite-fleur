import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Object3DHelper } from "./PointHelper";

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

const obj_test = new THREE.Object3D();
scene.add(obj_test);
obj_test.add(new Object3DHelper());
obj_test.position.set(0, 3, 0);

{
    const color = 0xffff;
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
    }
    return needResize;
}

let stop = false;

function render(time: number) {
    time *= 0.001; // convert time to seconds

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }

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
