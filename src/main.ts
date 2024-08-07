/* eslint-disable @typescript-eslint/no-unused-vars */
import * as THREE from "three";
import { resizeRendererToDisplaySize, Simulator } from "./Simulator";
import { Ball } from "./Ball";
import { Juggler } from "./Juggler";
import * as TWEAKPANE from "tweakpane";
import * as EssentialsPlugin from "@tweakpane/plugin-essentials";
import { JugglingEvent } from "./Timeline";
import { Hand } from "./Hand";
import * as Tone from "tone";
import { MyVisitor, makeTree, thrown } from "./ParserLexerPattern";
import { lance, lance_pattern } from "./Interactive_siteswap_player";

//TODO : With react, handle volume button being pressed as interaction ?
//TODO : Test on phone if touch correctly starts audio
//TODO : Add the option for no audio/normal audio/spatialized audio
//TODO : Add option to mute a juggler/some balls ?
//TODO : Camlecase or underscores ?
//TODO Bugged buffer load if not await in main code.

const transport = Tone.getTransport();
// const transport = new TransportPlayback();
const context = Tone.getContext();

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

const weak_hit = ["weak_hit1", "weak_hit2"];
const normal_hit = ["normal_hit1", "normal_hit2"];
const heavy_hit = ["heavy_hit1", "heavy_hit2", "heavy_hit3"];

const music = new Audio("petite_fleur_vincent.mp3");
const music_tone = context.createMediaElementSource(music);
const music_gain = new Tone.Gain().toDestination();
Tone.connect(music_tone, music_gain);
const sfx_gain = new Tone.Gain().toDestination();
sfx_gain.gain.value = 0;
music_gain.gain.value = 0;

// await Tone.loaded();
// await Tone.start();
music.addEventListener("canplaythrough", handle_sounds_loaded, { once: true });
// handle_sounds_loaded().catch(() => {
//     throw new Error("Oh no...");
// });

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

simulator.jugglers = [new Juggler(2.0)];
const vincent = simulator.jugglers[0];
// vincent.mesh.position.set(-1, 0, 1);
// vincent.mesh.rotateY(Math.PI / 2);

//TODO : Handle properly this await (by loading the sounds for the balls only when Tone has loaded the buffer.)
await Tone.loaded();
for (const color of ["red", "green", "blue"]) {
    const player = new Tone.Players(sfx_buffers);
    const panner = new Tone.Panner3D({ panningModel: "HRTF", rolloffFactor: 1 });
    player.connect(panner);
    panner.connect(sfx_gain);
    simulator.balls.push(new Ball(color, 0.08, player, panner));
}

const tweakpane_container = document.querySelector(".tp-dfwv");
if (!(tweakpane_container instanceof HTMLElement)) {
    throw new Error();
}
const pane = new TWEAKPANE.Pane({ container: tweakpane_container });

//////////////// Petite Fleur ////////////////

// Petite Fleur
// const left = vincent.left_hand;
// const right = vincent.right_hand;
// let ball0 = simulator.balls[0];
// let ball1 = simulator.balls[1];
// let ball2 = simulator.balls[2];
// const u = 60 / 265;
// const d = u / 3;
// // const t = 56.153;

// let t = 0;
// for (let i = 0; i < 10; i++) {
//     lance(ball0, t + 0 * u, 3.5 * u - d, left, left, u, heavy_hit);
//     lance(ball1, t + 1 * u, 4 * u - d, right, left, u, heavy_hit);
//     lance(ball2, t + 2 * u, 1 * u - d, left, right, u, heavy_hit);
//     lance(ball2, t + 3 * u, 3 * u - d, right, left, u, normal_hit);
//     lance(ball0, t + 3.5 * u, 0.5 * u - d, left, right, u, heavy_hit);
//     // lance(ball0, t + 4 * u, 1.5 * u - d, right, right, u);
//     lance(ball1, t + 5 * u, 2 * u - d, left, right, u, normal_hit);
//     lance(ball0, t + 5.5 * u, 3.5 * u - d, right, right, u, normal_hit);
//     lance(ball2, t + 6 * u, 4 * u - d, left, left, u, normal_hit);
//     lance(ball1, t + 7 * u, 1 * u - d, right, left, u, heavy_hit);
//     const tmp = ball0;
//     ball0 = ball1;
//     ball1 = tmp;
//     ball2 = ball2;
//     t = t + 8 * u;
// }

//////////////// Editeur de patterns ////////////////

// Configuration
const colors = ["red", "green", "blue", "purple", "yellow", "orange", "pink"];
const u2 = 0.25;
const d2 = u2 / 2;
//Default value of siteswap in siteswap_blade
const PARAMS = {
    Siteswap: "(6,6)(2x,2x)(4,4)"
};
//Build siteswap_blade and check change
const siteswap_blade = pane.addBinding(PARAMS, "Siteswap", { index: 5 });
siteswap_blade.on("change", (ev) => {
    if (ev.value != "") {
        const tree = makeTree(ev.value);
        const childType = tree.children[0].constructor.name;
        if (childType != "ErrorNode") {
            console.assert(
                childType === "SequenceContext" ||
                    childType === "Synchr_sequenceContext" ||
                    childType === "Mirror_patternContext"
            );
            const visitor = new MyVisitor<thrown>();
            const pattern = visitor.visit(tree);
            if (pattern != null) {
                console.log(pattern);
                lance_pattern(
                    pattern,
                    colors,
                    u2,
                    d2,
                    vincent,
                    simulator,
                    b_invalid_siteswap,
                    scene
                );
            }
        }
    }
});
const b_invalid_siteswap = pane.addButton({ index: 6, title: "Invalid Siteswap" });
b_invalid_siteswap.on("click", () => {
    //siteswap_blade.hidden = !siteswap_blade.hidden;
    b_invalid_siteswap.hidden = !b_invalid_siteswap.hidden;
});
b_invalid_siteswap.hidden = !b_invalid_siteswap.hidden;

const tree = makeTree(PARAMS.Siteswap);

const visitor = new MyVisitor<thrown>();
const pattern = visitor.visit(tree);

if (pattern != null) {
    lance_pattern(pattern, colors, u2, d2, vincent, simulator, b_invalid_siteswap, scene);
}

//////////////// Editeur de patterns ////////////////

// const u = 0.25;
// const d = u / 2;
// for (let i = 0; i < 100; i++) {
//     lance(
//         simulator.balls[i % 3],
//         1 + i * u,
//         3 * u - d,
//         vincent.hands[i % 2],
//         vincent.hands[(i + 1) % 2],
//         u,
//         ["normal_hit1", "normal_hit2"]
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

pane.registerPlugin(EssentialsPlugin);
const fpsGraph = pane.addBlade({
    index: 0,
    view: "fpsgraph",
    label: "FPS",
    rows: 2
}) as EssentialsPlugin.FpsGraphBladeApi;
const monitor = {
    video_time: 0,
    audio_time: 0,
    audio_control: 0,
    playback_rate: 1,
    transport_play: transport.state === "started",
    music: music
};
pane.addBinding(monitor, "video_time", {
    index: 1,
    readonly: true
});
pane.addBinding(monitor, "audio_time", {
    index: 2,
    readonly: true
});
const blade = pane.addBinding(monitor, "audio_time", {
    index: 3,
    min: 0,
    max: 100,
    step: 0.1
});
blade.on("change", (ev) => {
    if (ev.last) {
        music.currentTime = ev.value;
        if (monitor.transport_play && music.paused) {
            music.play().catch(() => {
                throw new Error("Problem");
            });
        }
    }
});

const blade_playback_rate = pane.addBinding(monitor, "playback_rate", {
    index: 4,
    min: 0.5,
    max: 2,
    step: 0.1
});
blade_playback_rate.on("change", (ev) => {
    if (ev.last) {
        music.playbackRate = ev.value;
    }
});
const play_blade = pane.addBinding(monitor, "transport_play", { index: 7, label: "Play" });
play_blade.on("change", async (ev) => {
    if (!ev.value) {
        // transport.pause();
        music.pause();
    } else {
        if (Tone.getContext().state === "suspended") {
            await Tone.start();
        }
        await Tone.loaded();
        await music.play();
    }
});

function render(t: number) {
    fpsGraph.begin();
    const time = t * 0.001; // convert time to seconds
    const audio_time = music.currentTime;
    monitor.video_time = time;
    monitor.audio_time = audio_time;

    resizeRendererToDisplaySize(renderer, camera);

    simulator.balls.forEach((ball) => {
        ball.render(audio_time);
        if (!music.paused) {
            ball.play_on_catch(audio_time);
        }
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

    fpsGraph.end();
    requestAnimationFrame(render);
}

simulator.jugglers.forEach((juggler) => {
    scene.add(juggler.mesh);
});
simulator.balls = simulator.balls.filter((ball) => {
    return ball.timeline.length !== 0;
});
simulator.balls.forEach((ball) => {
    scene.add(ball.mesh);
});

//TODO : Merge geometries ?
// {
//     //Chest
//     let chest_geometry: THREE.BufferGeometry = new THREE.CylinderGeometry(
//         0.6 * Math.SQRT1_2,
//         0.4 * Math.SQRT1_2,
//         1,
//         4,
//         1
//     );
//     chest_geometry.rotateY(Math.PI / 4);
//     chest_geometry = chest_geometry.toNonIndexed();
//     chest_geometry.computeVertexNormals();
//     chest_geometry.scale(0.5, 1, 1);
//     const chest_material = new THREE.MeshPhongMaterial({ color: "green" });
//     const chest = new THREE.Mesh(chest_geometry, chest_material);
//     chest.position.set(0, 1.7, 0);
//     scene.add(chest);

//     //Head
//     const head_geometry = new THREE.SphereGeometry(0.2);
//     head_geometry.scale(0.8, 1, 0.8);
//     const head = new THREE.Mesh(head_geometry, chest_material);
//     head.position.set(0, 0.75, 0);
//     chest.add(head);

//     //Shoulders
//     const shoulder_material = new THREE.MeshPhongMaterial({ color: "red" });
//     const shoulder_geometry = new THREE.SphereGeometry(0.08);
//     const right_shoulder = new THREE.Mesh(shoulder_geometry, shoulder_material);
//     right_shoulder.position.set(0, 0.5, 0.3);
//     //right_shoulder.material.visible = false;
//     right_shoulder.rotateZ(-Math.PI / 2);
//     right_shoulder.rotateY(-0.2);
//     chest.add(right_shoulder);
//     const left_shoulder = new THREE.Mesh(shoulder_geometry, shoulder_material);
//     left_shoulder.position.set(0, 0.5, -0.3);
//     left_shoulder.rotateZ(-Math.PI / 2);
//     left_shoulder.rotateY(0.2);
//     chest.add(left_shoulder);

//     //Arms
//     const arm_length = 0.55;
//     const arm_material = new THREE.MeshPhongMaterial({ color: "white" });
//     const arm_geometry = new THREE.BoxGeometry(arm_length, 0.05, 0.05);
//     // const arm_geometry = new THREE.CylinderGeometry(0.03, 0.03, arm_length);
//     // arm_geometry.rotateZ(Math.PI / 2);
//     const right_arm = new THREE.Mesh(arm_geometry, arm_material);
//     right_arm.position.set(arm_length / 2, 0, 0);
//     right_shoulder.add(right_arm);
//     const left_arm = new THREE.Mesh(arm_geometry, arm_material);
//     left_arm.position.set(arm_length / 2, 0, 0);
//     left_shoulder.add(left_arm);

//     //Elbows
//     const elbow_geometry = new THREE.SphereGeometry(0.05);
//     const right_elbow = new THREE.Mesh(elbow_geometry, shoulder_material);
//     right_elbow.position.set(arm_length / 2, 0, 0);
//     right_elbow.rotateZ(Math.PI / 2);
//     right_arm.add(right_elbow);
//     const left_elbow = new THREE.Mesh(elbow_geometry, shoulder_material);
//     left_elbow.position.set(arm_length / 2, 0, 0);
//     left_elbow.rotateZ(Math.PI / 2);
//     left_arm.add(left_elbow);

//     //Forearms
//     const right_forearm = new THREE.Mesh(arm_geometry, arm_material);
//     right_forearm.position.set(arm_length / 2, 0, 0);
//     right_elbow.add(right_forearm);
//     const left_forearm = new THREE.Mesh(arm_geometry, arm_material);
//     left_forearm.position.set(arm_length / 2, 0, 0);
//     left_elbow.add(left_forearm);

//     //Hands
//     const hand_geometry = new THREE.SphereGeometry(0.05);
//     hand_geometry.scale(1, 0.8, 0.8);
//     const hand_material = new THREE.MeshPhongMaterial({ color: "black" });
//     const right_hand = new THREE.Mesh(hand_geometry, hand_material);
//     right_hand.position.set(arm_length / 2, 0, 0);
//     right_forearm.add(right_hand);
//     const left_hand = new THREE.Mesh(hand_geometry, hand_material);
//     left_hand.position.set(arm_length / 2, 0, 0);
//     left_forearm.add(left_hand);

//     //Legs
//     const leg_geometry = new THREE.BoxGeometry(0.15, 1.2, 0.1);
//     const right_leg = new THREE.Mesh(leg_geometry, chest_material);
//     right_leg.position.set(0, -1.1, 0.15);
//     chest.add(right_leg);
//     const left_leg = new THREE.Mesh(leg_geometry, chest_material);
//     left_leg.position.set(0, -1.1, -0.15);
//     chest.add(left_leg);
// }

requestAnimationFrame(render);
