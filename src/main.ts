import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Object3DHelper } from "./Object3DHelper";
import { createRBTree, RBTree } from "./RBTree";
import { resizeRendererToDisplaySize, Simulator } from "./Simulator";
import { Ball } from "./Ball";
import { Juggler } from "./Juggler";
import * as TWEAKPANE from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";

const simulator = new Simulator("#simulator_canvas");

//const balls: Ball[] = [new Ball("red", 0.1)];
const jugglers: Juggler[] = [new Juggler()];
simulator.jugglers = jugglers;
const scene = simulator.scene;
const renderer = simulator.renderer;
const camera = simulator.camera;
simulator.scene.add(jugglers[0].mesh);

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

function render(time: number) {
    fpsGraph.begin();
    time *= 0.001; // convert time to seconds
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


