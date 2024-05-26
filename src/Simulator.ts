import * as THREE from "three";
import { Ball } from "./Ball";
import { Juggler } from "./Juggler";

class Simulator {
    renderer: THREE.WebGLRenderer;
    balls: Ball[];
    jugglers: Juggler[];

    constructor(canvas_id: string) {
        const canvas = document.querySelector(canvas_id);
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error("The provided canvas_id is not of type HTMLCanvasElement.");
        }
        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
    }
}

export { Simulator };
