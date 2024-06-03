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

simulator.jugglers = [new Juggler(2.0), new Juggler(2.0)];
const vincent = simulator.jugglers[0];
const nicolas = simulator.jugglers[1];
// const right_hand = juggler.hands[0];
// const left_hand = juggler.hands[1];
simulator.jugglers.forEach((juggler) => {
    scene.add(juggler.mesh);
});

vincent.mesh.position.set(-1, 0, 1);
vincent.mesh.rotateY(Math.PI / 2);
nicolas.mesh.position.set(-1, 0, -1);
nicolas.mesh.rotateY(-Math.PI / 2);

simulator.balls = [new Ball("red", 0.08), new Ball("green", 0.08), new Ball("blue", 0.08)];
const ball0 = simulator.balls[0];
const ball1 = simulator.balls[1];
const ball2 = simulator.balls[2];

simulator.balls.forEach((ball) => {
    scene.add(ball.mesh);
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

lance(ball0, 1, 1, vincent.right_hand, nicolas.left_hand, 0.5);
const spline = vincent.right_hand.get_spline(
    vincent.right_hand.timeline.lt(0.9).value,
    vincent.right_hand.timeline.gt(0.9).value
);
const curve = new SplineThree(spline);
const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.01, 8, false);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const tubeMesh = new THREE.Mesh(tubeGeometry, material);
scene.add(tubeMesh);

// const u = 0.25;
// const d = u / 2;
// lance(ball0);
// for (let i = 0; i < 100; i++) {
//     lance(
//         simulator.balls[i % 3],
//         1 + i * u,
//         3 * u - d,
//         vincent.hands[i % 2],
//         vincent.hands[(i + 1) % 2],
//         u
//     );
// }

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
