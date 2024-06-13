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
import * as Tone from "tone";

//TODO : Add button press to enable clean audio start.
//TODO : Test positional audio (too ressource expensive ?)
//TODO : Using Tone.Player can't play two sounds at once.
// console.log(Tone.getContext().state);

// const wait_screen = document.querySelector("#wait_screen")!;
// wait_screen.addEventListener("click");

const transport = Tone.getTransport();

const sfx = new Tone.Players({
    urls: {
        heavy_hit1: "grelot_balls_sfx/heavy_hit1.mp3",
        heavy_hit2: "grelot_balls_sfx/heavy_hit2.mp3",
        heavy_hit3: "grelot_balls_sfx/heavy_hit3.mp3",
        normal_hit1: "grelot_balls_sfx/normal_hit1.mp3",
        normal_hit2: "grelot_balls_sfx/normal_hit2.mp3",
        weak_hit1: "grelot_balls_sfx/weak_hit1.mp3",
        weak_hit2: "grelot_balls_sfx/weak_hit2.mp3",
        shaker: "grelot_balls_sfx/shaker.mp3",
        weak_hit_shaker: "grelot_balls_sfx/weak_hit_shaker.mp3"
    }
});
const sfx_gain = new Tone.Volume().toDestination();
sfx.connect(sfx_gain);
//Playing sounds test
//await Tone.loaded().then(() => {
//sfx.player("heavy_hit1").start("+0");
//sfx.player("heavy_hit2").start("+1");
//sfx.player("heavy_hit3").start("+2");
// sfx.player("normal_hit1").start("+3");
// sfx.player("normal_hit2").start("+4");
// sfx.player("weak_hit1").start("+5");
// sfx.player("weak_hit2").start("+6");
// sfx.player("shaker").start("+7");
// sfx.player("weak_hit_shaker").start("+8");
//});

const music = new Tone.Player("petite_fleur_vincent.mp3").toDestination();
const music_gain = new Tone.Gain().toDestination();
music.connect(music_gain);
music.sync().start(0);

// await Tone.loaded().then(() => {
//     if (Tone.getContext().state === "running") {
//         //transport.start();
//     }
// });

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

{
    //Chest
    let chest_geometry: THREE.BufferGeometry = new THREE.CylinderGeometry(
        0.6 * Math.SQRT1_2,
        0.4 * Math.SQRT1_2,
        1,
        4,
        1
    );
    chest_geometry.rotateY(Math.PI / 4);
    chest_geometry = chest_geometry.toNonIndexed();
    chest_geometry.computeVertexNormals();
    chest_geometry.scale(0.5, 1, 1);
    const chest_material = new THREE.MeshPhongMaterial({ color: "green" });
    const chest = new THREE.Mesh(chest_geometry, chest_material);
    chest.position.set(0, 1.7, 0);
    scene.add(chest);

    //Head
    const head_geometry = new THREE.SphereGeometry(0.2);
    head_geometry.scale(0.8, 1, 0.8);
    const head = new THREE.Mesh(head_geometry, chest_material);
    head.position.set(0, 0.75, 0);
    chest.add(head);

    //Shoulders
    const shoulder_material = new THREE.MeshPhongMaterial({ color: "red" });
    const shoulder_geometry = new THREE.SphereGeometry(0.08);
    const right_shoulder = new THREE.Mesh(shoulder_geometry, shoulder_material);
    right_shoulder.position.set(0, 0.5, 0.3);
    //right_shoulder.material.visible = false;
    right_shoulder.rotateZ(-Math.PI / 2);
    right_shoulder.rotateY(-0.2);
    chest.add(right_shoulder);
    const left_shoulder = new THREE.Mesh(shoulder_geometry, shoulder_material);
    left_shoulder.position.set(0, 0.5, -0.3);
    left_shoulder.rotateZ(-Math.PI / 2);
    left_shoulder.rotateY(0.2);
    chest.add(left_shoulder);

    //Arms
    const arm_length = 0.55;
    const arm_material = new THREE.MeshPhongMaterial({ color: "white" });
    const arm_geometry = new THREE.BoxGeometry(arm_length, 0.05, 0.05);
    // const arm_geometry = new THREE.CylinderGeometry(0.03, 0.03, arm_length);
    // arm_geometry.rotateZ(Math.PI / 2);
    const right_arm = new THREE.Mesh(arm_geometry, arm_material);
    right_arm.position.set(arm_length / 2, 0, 0);
    right_shoulder.add(right_arm);
    const left_arm = new THREE.Mesh(arm_geometry, arm_material);
    left_arm.position.set(arm_length / 2, 0, 0);
    left_shoulder.add(left_arm);

    //Elbows
    const elbow_geometry = new THREE.SphereGeometry(0.05);
    const right_elbow = new THREE.Mesh(elbow_geometry, shoulder_material);
    right_elbow.position.set(arm_length / 2, 0, 0);
    right_elbow.rotateZ(Math.PI / 2);
    right_arm.add(right_elbow);
    const left_elbow = new THREE.Mesh(elbow_geometry, shoulder_material);
    left_elbow.position.set(arm_length / 2, 0, 0);
    left_elbow.rotateZ(Math.PI / 2);
    left_arm.add(left_elbow);

    //Forearms
    const right_forearm = new THREE.Mesh(arm_geometry, arm_material);
    right_forearm.position.set(arm_length / 2, 0, 0);
    right_elbow.add(right_forearm);
    const left_forearm = new THREE.Mesh(arm_geometry, arm_material);
    left_forearm.position.set(arm_length / 2, 0, 0);
    left_elbow.add(left_forearm);

    //Hands
    const hand_geometry = new THREE.SphereGeometry(0.05);
    hand_geometry.scale(1, 0.8, 0.8);
    const hand_material = new THREE.MeshPhongMaterial({ color: "black" });
    const right_hand = new THREE.Mesh(hand_geometry, hand_material);
    right_hand.position.set(arm_length / 2, 0, 0);
    right_forearm.add(right_hand);
    const left_hand = new THREE.Mesh(hand_geometry, hand_material);
    left_hand.position.set(arm_length / 2, 0, 0);
    left_forearm.add(left_hand);

    //Legs
    const leg_geometry = new THREE.BoxGeometry(0.15, 1.2, 0.1);
    const right_leg = new THREE.Mesh(leg_geometry, chest_material);
    right_leg.position.set(0, -1.1, 0.15);
    chest.add(right_leg);
    const left_leg = new THREE.Mesh(leg_geometry, chest_material);
    left_leg.position.set(0, -1.1, -0.15);
    chest.add(left_leg);

    //Feet
    //???
}

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
const tweakpane_container = document.querySelector(".tp-dfwv");
if (!(tweakpane_container instanceof HTMLElement)) {
    throw new Error();
}
const pane = new TWEAKPANE.Pane({ container: tweakpane_container });
pane.registerPlugin(EssentialsPlugin);
const fpsGraph = pane.addBlade({
    view: "fpsgraph",
    label: "FPS",
    rows: 2
}) as EssentialsPlugin.FpsGraphBladeApi;
const monitor = {
    video_time: 0,
    audio_time: 0,
    audio_control: 0,
    transport_play: transport.state === "started"
};
pane.addBinding(monitor, "video_time", {
    readonly: true
});
pane.addBinding(monitor, "audio_time", {
    readonly: true
});
const blade = pane.addBinding(monitor, "audio_time", {
    min: 0,
    max: music.buffer.duration,
    step: 0.1
});
blade.on("change", (ev) => {
    // console.log(`Value : ${ev.value} Last : ${ev.last}`);
    if (ev.last) {
        transport.seconds = ev.value;
    }
});
const play_blade = pane.addBinding(monitor, "transport_play", { label: "Play" });
play_blade.on("change", (ev) => {
    if (Tone.getContext().state === "suspended") {
        async () => {
            await Tone.start();
        };
    }
    if (!ev.value) {
        transport.pause();
    } else {
        transport.start();
    }
});

function render(t: number) {
    fpsGraph.begin();
    const time = t * 0.001; // convert time to seconds
    const audio_time = transport.seconds;
    monitor.video_time = time;
    monitor.audio_time = audio_time;
    // console.log(`Without look ahead : ${transport.immediate()}`);
    // console.log(`With look ahead : ${transport.now()}`);
    // console.log(`Look ahead : ${transport.context.lookAhead}`);
    resizeRendererToDisplaySize(renderer, camera);

    simulator.balls.forEach((ball) => {
        ball.render(audio_time);
    });
    simulator.jugglers.forEach((juggler) => {
        juggler.render(audio_time);
    });

    renderer.render(scene, camera);

    fpsGraph.end();
    requestAnimationFrame(render);
}

simulator.balls = simulator.balls.filter((ball) => {
    return ball.timeline.length !== 0;
});
requestAnimationFrame(render);
