import * as THREE from "three";
import { resizeRendererToDisplaySize, Simulator } from "./Simulator";
import { Ball } from "./Ball";
import { Juggler } from "./Juggler";
import * as TWEAKPANE from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { JugglingEvent } from "./Timeline";
import { SplineThree } from "./utils";
import { Hand } from "./Hand";
import { CubicHermiteSpline } from "./Spline";
import { VECTOR3_STRUCTURE } from "./constants";
import { BlurShaderUtils } from "three/examples/jsm/Addons.js";

const simulator = new Simulator("#simulator_canvas");
const scene = simulator.scene;
const renderer = simulator.renderer;
const camera = simulator.camera;

// const arm_length = 1;
// const forearm_length = 1;
// const arm_material = new THREE.MeshPhongMaterial({ color: "white" });
// const elbow_material = new THREE.MeshPhongMaterial({ color: "red" });
// const elbow_geometry = new THREE.SphereGeometry(0.3);
// const arm_geometry = new THREE.BoxGeometry(arm_length, 0.2, 0.2);
// const arm_mesh = new THREE.Mesh(arm_geometry, arm_material);
// const forearm_mesh = new THREE.Mesh(arm_geometry, arm_material);
// const elbow_mesh = new THREE.Mesh(elbow_geometry, elbow_material);


simulator.jugglers = [new Juggler(2.0)];
const vincent = simulator.jugglers[0];
//const nicolas = simulator.jugglers[1];
// const right_hand = juggler.hands[0];
// const left_hand = juggler.hands[1];
simulator.jugglers.forEach((juggler) => {
    scene.add(juggler.mesh);
});

vincent.mesh.position.set(-1, 0, 1);
vincent.mesh.rotateY(Math.PI / 2);
// nicolas.mesh.position.set(-1, 0, -1);
// nicolas.mesh.rotateY(-Math.PI / 2);

simulator.balls = [new Ball("red", 0.08), new Ball("green", 0.08), new Ball("blue", 0.08)];
const ball0 = simulator.balls[0];
const ball1 = simulator.balls[1];
const ball2 = simulator.balls[2];

simulator.balls.forEach((ball) => {
    scene.add(ball.mesh);
    //ball.mesh.visible = false;
});

function lance(
    ball: Ball,
    time: number,
    flight_time: number,
    source: Hand,
    target: Hand,
    unit_time: number
): void {
    const ev1 = new JugglingEvent(time, unit_time, "THROW", source, ball);
    const ev2 = new JugglingEvent(time + flight_time, unit_time, "CATCH", target, ball);
    ev1.pair_with(ev2);
    ball.timeline = ball.timeline.insert(ev1.time, ev1);
    ball.timeline = ball.timeline.insert(ev2.time, ev2);
    source.timeline = source.timeline.insert(ev1.time, ev1);
    target.timeline = target.timeline.insert(ev2.time, ev2);
}

// lance(ball0, 1, 1, vincent.right_hand, nicolas.left_hand, 0.5);
// const spline = vincent.right_hand.get_spline(
//     vincent.right_hand.timeline.lt(0.9).value,
//     vincent.right_hand.timeline.gt(0.9).value
// );
// const curve = new SplineThree(spline);
// const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.01, 8, false);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const tubeMesh = new THREE.Mesh(tubeGeometry, material);
// scene.add(tubeMesh);

const u = 0.25;
const d = u / 2;
for (let i = 0; i < 100; i++) {
    lance(
        simulator.balls[i % 3],
        1 + i * u,
        3 * u - d,
        vincent.hands[i % 2],
        vincent.hands[(i + 1) % 2],
        u
    );
}

// lance(ball1, 1 + 1*u, 3 * u - d, left_hand, right_hand, u);
// lance(ball2, 1 + 2*u, 3 * u - d, right_hand, left_hand, u);
// lance(ball0, 1 + 3*u, 3 * u - d, left_hand, right_hand, u);
// lance(ball1, 1 + 4*u, 3 * u - d, right_hand, left_hand, u);
// lance(ball2, 1 + 5*u, 3 * u - d, left_hand, right_hand, u);
// lance(ball0, 1, 1, right_hand, left_hand, 0.5);
// lance(ball0, 1, 1, right_hand, left_hand, 0.5);
// lance(ball0, 1, 1, right_hand, left_hand, 0.5);

//TODO : Ball and Hand inherit Object3D For easier manipulation ?
//TODO : How to have a ball taht stays in the hand ?

// const ev1 = new JugglingEvent(1, 0.5, "THROW", vincent.right_hand, ball0);
// const ev2 = new JugglingEvent(1.2, 0.5, "CATCH", nicolas.left_hand, ball0);
// const ev3 = new JugglingEvent(2, 0.5, "THROW", vincent.left_hand, ball1);
// const ev4 = new JugglingEvent(2.2, 0.5, "CATCH", vincent.left_hand, ball1);
// const ev5 = new JugglingEvent(1, 0.5, "THROW", vincent.right_hand, ball0);
// const ev6 = new JugglingEvent(1.4, 0.5, "CATCH", nicolas.left_hand, ball0);

// //TODO: REmplacer l'appareillage par une recherche dans la timeline de la balle.
// ev1.pair_with(ev2);
// ev3.pair_with(ev4);
// ev5.pair_with(ev6);
// ball0.timeline = ball0.timeline.insert(ev1.time, ev1);
// ball0.timeline = ball0.timeline.insert(ev2.time, ev2);
// ball1.timeline = ball1.timeline.insert(ev3.time, ev3);
// ball1.timeline = ball1.timeline.insert(ev4.time, ev4);
// ball2.timeline = ball2.timeline.insert(ev5.time, ev5);
// ball2.timeline = ball2.timeline.insert(ev6.time, ev6);

// vincent.right_hand.timeline = vincent.right_hand.timeline.insert(ev1.time, ev1);
// nicolas.left_hand.timeline = nicolas.left_hand.timeline.insert(ev2.time, ev2);
// vincent.left_hand.timeline = vincent.left_hand.timeline.insert(ev3.time, ev3);
// vincent.left_hand.timeline = vincent.left_hand.timeline.insert(ev4.time, ev4);
// vincent.right_hand.timeline = vincent.right_hand.timeline.insert(ev5.time, ev5);
// nicolas.left_hand.timeline = nicolas.left_hand.timeline.insert(ev6.time, ev6);

// const curvepath = new THREE.CurvePath();
// const curve1 = new SplineThree(right_hand.get_spline(undefined));

// const spline = new CubicHermiteSpline<THREE.Vector3>(
//     VECTOR3_STRUCTURE,
//     [new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1)],
//     [new THREE.Vector3(1, 1, 0), new THREE.Vector3(1, -1, 0)]
// );
// const curve = new SplineThree(spline);
// console.log(spline.interpolate(0));
// console.log(spline.interpolate(1));
// const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.01, 8, false);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const tubeMesh = new THREE.Mesh(tubeGeometry, material);
// scene.add(tubeMesh);

const pane = new TWEAKPANE.Pane();
pane.registerPlugin(EssentialsPlugin);
const fpsGraph = pane.addBlade({
    view: "fpsgraph",
    label: "FPS",
    rows: 2
}) as EssentialsPlugin.FpsGraphBladeApi;
const monitor = { time: 0 };
pane.addBinding(monitor, "time", {
    readonly: true
});

function render(t: number) {
    fpsGraph.begin();
    const time = t * 0.001; // convert time to seconds
    monitor.time = time;
    resizeRendererToDisplaySize(renderer, camera);

    simulator.balls.forEach((ball) => {
        ball.render(time);
    });
    simulator.jugglers.forEach((juggler) => {
        juggler.render(time);
    });

    renderer.render(scene, camera);

    fpsGraph.end();
    requestAnimationFrame(render);
}

simulator.balls = simulator.balls.filter((ball) => {
    return ball.timeline.length !== 0;
});
requestAnimationFrame(render);
// height = height;
// const basic_geometry = new THREE.BoxGeometry(width, height, depth, 1, 1, 1);
// //this.geometry = new THREE.EdgesGeometry(basic_geometry);
// //this.material = new THREE.LineBasicMaterial({ color: "black", linewidth: 2 });
// const geometry2 = basic_geometry;
// const material = new THREE.MeshPhongMaterial({ color: "black" });
// const mesh = new THREE.Mesh();
// // const hand_physics_handling: HandPhysicsHandling = {
// //     min_dist: 0.05,
// //     max_dist: width,
// //     up_vector: new THREE.Vector3(0, 1, 0),
// //     right_vector: new THREE.Vector3(1, 0, 0)
// // };
// // this.hands = [new Hand(hand_physics_handling, true), new Hand(hand_physics_handling, false)];

// // this.juggling_origin = new THREE.Object3D();
// // this.juggling_origin.position.set(arm_length, 0, 0);

// // this.mesh.add(this.juggling_origin);
// // this.juggling_origin.add(this.hands[0].mesh);
// // this.juggling_origin.add(this.hands[1].mesh);

// const boxWidth = 1;
// const boxHeight = 1;
// const boxDepth = 1;
// const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

// function makeInstance(geometry, color, x) {
//     const material = new THREE.MeshPhongMaterial({ color });

//     const cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);

//     cube.position.x = x;

//     return cube;
// }

// const cubes = [
//     makeInstance(geometry, 0x44aa88, 0),
//     makeInstance(geometry, 0x8844aa, -2),
//     makeInstance(geometry, 0xaa8844, 2)
// ];

// console.log("done");
// function render(time) {
//     time *= 0.001;

//     resizeRendererToDisplaySize(renderer, camera);

//     cubes.forEach((cube, ndx) => {
//         const speed = 1 + ndx * 0.1;
//         const rot = time * speed;
//         cube.rotation.x = rot;
//         cube.rotation.y = rot;
//     });

//     renderer.render(scene, camera);

//     requestAnimationFrame(render);
// }

// requestAnimationFrame(render);
// function create_timelines(siteswap: number[]) {
//     let sum = 0;
//     siteswap.forEach((element) => {
//         sum += element;
//     });
//     const mean = sum / siteswap.length;
//     if (!Number.isInteger(mean)) {
//         throw new Error("Siteswap sequence is not valid")
//     }
// }

/*
function create_hand_events(
    pattern: string,
    dwell_time: number,
    siteswap_unit_time: number,
    nb_hands: number,
    balls_init_config:
): RBTree<number, EventData>[] {
    const hand_events: RBTree<number, EventData>[] = [];
    }
}*/

// import {
//     Bone,
//     Color,
//     CylinderGeometry,
//     DoubleSide,
//     Float32BufferAttribute,
//     MeshPhongMaterial,
//     PerspectiveCamera,
//     Scene,
//     SkinnedMesh,
//     Skeleton,
//     SkeletonHelper,
//     Vector3,
//     Uint16BufferAttribute,
//     WebGLRenderer
// } from "three";
// import { CCDIKSolver, CCDIKHelper } from "three/addons/animation/CCDIKSolver.js";

// import { GUI } from "three/addons/libs/lil-gui.module.min.js";
// import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// let gui, scene, camera, renderer, orbit, mesh, bones, skeletonHelper, ikSolver;

// const state = {
//     ikSolverAutoUpdate: true
// };

// function initScene() {
//     const canvas = document.querySelector("#simulator_canvas");

//     gui = new GUI();

//     scene = new Scene();
//     scene.background = new Color(0x444444);

//     camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
//     camera.position.z = 30;
//     camera.position.y = 30;

//     renderer = new WebGLRenderer({ antialias: true, canvas });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);

//     orbit = new OrbitControls(camera, renderer.domElement);
//     orbit.enableZoom = false;

//     window.addEventListener(
//         "resize",
//         function () {
//             camera.aspect = window.innerWidth / window.innerHeight;
//             camera.updateProjectionMatrix();

//             renderer.setSize(window.innerWidth, window.innerHeight);
//         },
//         false
//     );

//     initBones();
//     setupDatGui();
// }

// function createGeometry(sizing) {
//     const geometry = new CylinderGeometry(
//         5, // radiusTop
//         5, // radiusBottom
//         sizing.height, // height
//         8, // radiusSegments
//         sizing.segmentCount * 1, // heightSegments
//         true // openEnded
//     );

//     const position = geometry.attributes.position;

//     const vertex = new Vector3();

//     const skinIndices = [];
//     const skinWeights = [];

//     for (let i = 0; i < position.count; i++) {
//         vertex.fromBufferAttribute(position, i);

//         const y = vertex.y + sizing.halfHeight;

//         const skinIndex = Math.floor(y / sizing.segmentHeight);
//         const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight;

//         skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
//         skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
//     }

//     // geometry.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndices, 4));
//     // geometry.setAttribute("skinWeight", new Float32BufferAttribute(skinWeights, 4));

//     return geometry;
// }

// function createBones(sizing) {
//     bones = [];

//     // "root bone"
//     const rootBone = new Bone();
//     rootBone.name = "root";
//     rootBone.position.y = -sizing.halfHeight;
//     bones.push(rootBone);

//     //
//     // "bone0", "bone1", "bone2", "bone3"
//     //

//     // "bone0"
//     let prevBone = new Bone();
//     prevBone.position.y = 0;
//     rootBone.add(prevBone);
//     bones.push(prevBone);

//     // "bone1", "bone2", "bone3"
//     for (let i = 1; i <= sizing.segmentCount; i++) {
//         const bone = new Bone();
//         bone.position.y = sizing.segmentHeight;
//         bones.push(bone);
//         bone.name = `bone${i}`;
//         prevBone.add(bone);
//         prevBone = bone;
//     }

//     // "target"
//     const targetBone = new Bone();
//     targetBone.name = "target";
//     targetBone.position.y = sizing.height + sizing.segmentHeight; // relative to parent: rootBone
//     rootBone.add(targetBone);
//     bones.push(targetBone);

//     return bones;
// }

// function createMesh(geometry, bones) {
//     const material = new MeshPhongMaterial({
//         color: 0x156289,
//         emissive: 0x072534,
//         side: DoubleSide,
//         flatShading: true,
//         wireframe: true
//     });

//     const mesh = new SkinnedMesh(geometry, material);
//     const skeleton = new Skeleton(bones);

//     mesh.add(bones[0]);

//     mesh.bind(skeleton);

//     skeletonHelper = new SkeletonHelper(mesh);
//     skeletonHelper.material.linewidth = 2;
//     scene.add(skeletonHelper);

//     return mesh;
// }

// function setupDatGui() {
//     gui.add(mesh, "pose").name("mesh.pose()");

//     mesh.skeleton.bones
//         .filter((bone) => bone.name === "target")
//         .forEach(function (bone) {
//             const folder = gui.addFolder(bone.name);

//             const delta = 20;
//             folder.add(bone.position, "x", -delta + bone.position.x, delta + bone.position.x);
//             folder.add(bone.position, "y", -bone.position.y, bone.position.y);
//             folder.add(bone.position, "z", -delta + bone.position.z, delta + bone.position.z);
//         });

//     gui.add(ikSolver, "update").name("ikSolver.update()");
//     gui.add(state, "ikSolverAutoUpdate");
// }

// function initBones() {
//     const segmentHeight = 8;
//     const segmentCount = 3;
//     const height = segmentHeight * segmentCount;
//     const halfHeight = height * 0.5;

//     const sizing = {
//         segmentHeight,
//         segmentCount,
//         height,
//         halfHeight
//     };

//     const geometry = createGeometry(sizing);
//     const bones = createBones(sizing);
//     mesh = createMesh(geometry, bones);

//     scene.add(mesh);

//     //
//     // ikSolver
//     //

//     const iks = [
//         {
//             target: 5,
//             effector: 4,
//             links: [{ index: 3 }, { index: 2 }, { index: 1 }]
//         }
//     ];
//     ikSolver = new CCDIKSolver(mesh, iks);
//     scene.add(new CCDIKHelper(mesh, iks));
// }

// function render() {
//     requestAnimationFrame(render);

//     if (state.ikSolverAutoUpdate) {
//         ikSolver?.update();
//     }

//     renderer.render(scene, camera);
// }

// initScene();
// render();
