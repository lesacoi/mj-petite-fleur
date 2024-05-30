import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Object3DHelper } from "./Object3DHelper";
import { createRBTree, RBTree } from "./RBTree";
import { Simulator } from "./Simulator";
import { Ball } from "./Ball";
import { Juggler } from "./Juggler";

const simulator = new Simulator("#simulator_canvas");
requestAnimationFrame(simulator.render);

//const balls: Ball[] = [new Ball("red", 0.1)];
const jugglers: Juggler[] = [new Juggler()];
simulator.jugglers = jugglers;

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


