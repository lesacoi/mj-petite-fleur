import * as THREE from "three";
import {
    resizeRendererToDisplaySize,
    resizeRendererComposerToDisplaySize,
    Simulator
} from "./Simulator";
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
import { EffectComposer, OutlinePass, OutputPass, RenderPass } from "three/examples/jsm/Addons.js";
import { TransportPlayback } from "./TransportPlayBack";

//TODO : With react, handle volume button being pressed as interaction ?
//TODO : Test on phone if touch correctly starts audio
//TODO : Add the option for no audio/normal audio/spatialized audio
//TODO : Add option to mute a juggler/some balls ?
//TODO : Add playbackrate managementt to own class over Tone.Transport
// (to help handle seeking to the right time given a playback_rate / correct time when asking for the audio time)
//TODO : Camecase or underscores ?

//const transport = Tone.getTransport();
const transport = new TransportPlayback();

const handle_load_end = (function () {
    let load_ready = 0;

    return function () {
        load_ready++;
        if (load_ready === 2) {
            const wait_screen = document.querySelector("#wait_screen");
            if (!(wait_screen instanceof Element)) {
                throw new Error();
            }
            wait_screen.classList.add("fade_out");
            wait_screen.addEventListener("animationend", () => {
                wait_screen.remove();
            });
        }
    };
})();

// Handling of the first user input before playing audio.
const first_interaction_event_types = ["mousedown", "keydown", "touchstart"];
async function handle_first_interaction(event: Event) {
    for (const event_type of first_interaction_event_types) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        event.currentTarget?.removeEventListener(event_type, handle_first_interaction, true);
    }
    const text_element = document.querySelector("#wait_user");
    if (!(text_element instanceof HTMLParagraphElement)) {
        throw new Error();
    }
    text_element.textContent = "User interaction detected ✔️";
    await Tone.start();
    handle_load_end();
    //We block the promise until resolved
    // await Tone.start()
    //     .then(() => {
    //         console.log("User interaction detected. Ready to play audio");
    //         return Tone.loaded();
    //     })
    //     .then(() => {
    //         console.log("Audio buffers all loaded !");
    //         //transport.start();
    //     })
    //     .catch((reason: unknown) => {
    //         throw new Error(`Unable to setup the audio to play. Reason : ${reason}`);
    //         //console.log(reason);
    //     });
}

for (const event_type of first_interaction_event_types) {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    document.body.addEventListener(event_type, handle_first_interaction, true);
}

async function handle_sounds_loaded() {
    await Tone.loaded();
    const text_element = document.querySelector("#wait_load");
    if (!(text_element instanceof HTMLParagraphElement)) {
        throw new Error();
    }
    text_element.textContent = "Sound loaded ✔️";
    handle_load_end();
}

const sfx_buffers = {
    heavy_hit1: new Tone.ToneAudioBuffer("grelot_balls_sfx/heavy_hit1.mp3"),
    heavy_hit2: new Tone.ToneAudioBuffer("grelot_balls_sfx/heavy_hit2.mp3"),
    heavy_hit3: new Tone.ToneAudioBuffer("grelot_balls_sfx/heavy_hit3.mp3"),
    normal_hit1: new Tone.ToneAudioBuffer("grelot_balls_sfx/normal_hit1.mp3"),
    normal_hit2: new Tone.ToneAudioBuffer("grelot_balls_sfx/normal_hit2.mp3"),
    weak_hit1: new Tone.ToneAudioBuffer("grelot_balls_sfx/weak_hit1.mp3"),
    weak_hit2: new Tone.ToneAudioBuffer("grelot_balls_sfx/weak_hit2.mp3"),
    shaker: new Tone.ToneAudioBuffer("grelot_balls_sfx/shaker.mp3"),
    weak_hit_shaker: new Tone.ToneAudioBuffer("grelot_balls_sfx/weak_hit_shaker.mp3")
};

const music = new Tone.Player("petite_fleur_vincent.mp3");
//Panner Model : Sound is stereo, no decrease based on distance.
const panner = new Tone.Panner3D({ panningModel: "equalpower", rolloffFactor: 0 });

const music_gain = new Tone.Gain().toDestination();
const sfx_gain = new Tone.Gain().toDestination();
music.connect(panner);
panner.connect(music_gain);
// music_gain.gain.value = 0;
sfx_gain.gain.value = 0;
music.sync().start(0);
await Tone.loaded();
await Tone.start();
music.playbackRate = 1; //TODO Continuer ici.
// console.log(transport.bpm);
// transport.bpm.value = transport.bpm.value / 2;
transport.start();

handle_sounds_loaded().catch(() => {
    throw new Error();
});

// const player = new Tone.Players(sfx_buffers);
// const panner = new Tone.Panner3D();
// player.connect(panner);
// panner.connect(sfx_gain);
//Playing sounds test
// const sfx = new Tone.Players(sfx_buffers);
// const panner = new Tone.Panner3D({ maxDistance: 1000 });
// sfx.connect(panner);
// panner.connect(sfx_gain);
// await Tone.loaded().then(() => {
//     sfx.player("heavy_hit1").start("+0");
//     sfx.player("heavy_hit2").start("+1");
//     sfx.player("heavy_hit3").start("+2");
//     sfx.player("normal_hit1").start("+3");
//     sfx.player("normal_hit2").start("+4");
//     sfx.player("weak_hit1").start("+5");
//     sfx.player("weak_hit2").start("+6");
//     sfx.player("shaker").start("+7");
//     sfx.player("weak_hit_shaker").start("+8");
// });

const simulator = new Simulator("#simulator_canvas");
const scene = simulator.scene;
const renderer = simulator.renderer;
const camera = simulator.camera;

//TODO : Merge geometries ?
let outlined_mesh: THREE.Mesh;
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

    //Outline ?
    outlined_mesh = chest;
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

for (const color of ["red", "green", "blue"]) {
    const player = new Tone.Players(sfx_buffers);
    const panner = new Tone.Panner3D({ panningModel: "HRTF", rolloffFactor: 1 });
    player.connect(panner);
    panner.connect(sfx_gain);
    simulator.balls.push(new Ball(color, 0.08, player, panner));
}

const ball0 = simulator.balls[0];
const ball1 = simulator.balls[1];
const ball2 = simulator.balls[2];

// ball0.sound.player("normal_hit").start("+0.5");

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
    unit_time: number,
    sound?: string[] | string
): void {
    const ev1 = new JugglingEvent(time, unit_time, "THROW", source, ball);
    const ev2 = new JugglingEvent(time + flight_time, unit_time, "CATCH", target, ball, sound);
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

//////////////////////////////////////////////////////////////////////////////
// Edit here
//////////////////////////////////////////////////////////////////////////////

// Pattern
//const pattern = [5];
// const pattern = [3,3,4,5,1,5,1,4,1];

// // Configuration
// const colors = ["red", "green", "blue", "purple", "yellow"];
// const u = 0.25;
// const d = u / 2;

// // Build the balls
// const n_balls = pattern.reduce( ( p, c ) => p + c, 0 ) / pattern.length;
// simulator.balls = Array(n_balls);
// for (let i=0; i < simulator.balls.length; i++)
//     simulator.balls[i] = new Ball(colors[i], 0.04)

// // Build the sequence of throws
// const N = pattern.length * 50;
// const held_balls = Array(N);
// for (let i = 0; i < simulator.balls.length; i++) {
//     held_balls[i] = simulator.balls[i];
// }
// for (let i = 0; i < N - pattern.length; i++) {
//     let h = pattern[i % pattern.length];
//     held_balls[i+h] = held_balls[i];
//     lance(held_balls[i], i * u, h * u - d, vincent.hands[i % 2], vincent.hands[(i + h) % 2], u);
// }
//console.log(held_balls);

//////////////////////////////////////////////////////////////////////////////
// End edit here
//////////////////////////////////////////////////////////////////////////////

const u = 0.25;
const d = u / 2;
for (let i = 0; i < 100; i++) {
    lance(
        simulator.balls[i % 3],
        1 + i * u,
        3 * u - d,
        vincent.hands[i % 2],
        vincent.hands[(i + 1) % 2],
        u,
        ["normal_hit1", "normal_hit2"]
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
    //console.log(`Value : ${ev.value} Last : ${ev.last}`);
    if (ev.last) {
        transport.seconds = ev.value;
    }
});
const play_blade = pane.addBinding(monitor, "transport_play", { label: "Play" });
// eslint-disable-next-line @typescript-eslint/no-misused-promises
play_blade.on("change", async (ev) => {
    if (!ev.value) {
        transport.pause();
    } else {
        if (Tone.getContext().state === "suspended") {
            await Tone.start();
        }
        await Tone.loaded();
        transport.start();
    }
});

//TODO : Remove composer if not needed.
// const composer = new EffectComposer(renderer);
// const render_pass = new RenderPass(scene, camera);
// composer.addPass(render_pass);
// const canvas = renderer.domElement;
// const outline_pass = new OutlinePass(
//     new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
//     scene,
//     camera
// );
// composer.addPass(outline_pass);
// outline_pass.selectedObjects = [outlined_mesh];
// //ball0.material.transparent = true;
// //ball0.material.opacity = 0;
// // composer.setPixelRatio(window.devicePixelRatio);
// const output_pass = new OutputPass();
// composer.addPass(output_pass);

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
    // resizeRendererComposerToDisplaySize(renderer, composer, camera);

    simulator.balls.forEach((ball) => {
        ball.render(audio_time);
        ball.play_on_catch(audio_time);
    });
    simulator.jugglers.forEach((juggler) => {
        juggler.render(audio_time);
    });

    const listener = Tone.getListener();
    const camera_pos = camera.localToWorld(new THREE.Vector3(0, 0, 0));
    listener.positionX.value = camera_pos.x;
    listener.positionY.value = camera_pos.y;
    listener.positionZ.value = camera_pos.z;
    const camera_dir = camera.localToWorld(new THREE.Vector3(0, 0, -1)).sub(camera_pos);
    listener.forwardX.value = camera_dir.x;
    listener.forwardY.value = camera_dir.y;
    listener.forwardZ.value = camera_dir.z;
    const camera_up = camera.localToWorld(camera.up.clone()).sub(camera_pos);
    listener.upX.value = camera_up.x;
    listener.upY.value = camera_up.y;
    listener.upZ.value = camera_up.z;

    renderer.render(scene, camera);
    // composer.render();

    fpsGraph.end();
    requestAnimationFrame(render);
}

simulator.balls = simulator.balls.filter((ball) => {
    return ball.timeline.length !== 0;
});
requestAnimationFrame(render);
