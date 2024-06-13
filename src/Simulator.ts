import * as THREE from "three";
import { Ball } from "./Ball";
import { Juggler } from "./Juggler";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function resizeRendererToDisplaySize(
    renderer: THREE.WebGLRenderer,
    camera: THREE.PerspectiveCamera
) {
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



class Simulator {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    balls: Ball[];
    jugglers: Juggler[];

    constructor(canvas_id: string) {
        // Scene setup
        const canvas = document.querySelector(canvas_id);
        if (!(canvas instanceof HTMLCanvasElement)) {
            throw new Error("The provided canvas_id is not of type HTMLCanvasElement.");
        }
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        const scene = new THREE.Scene();
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 50);
        const controls = new OrbitControls(camera, renderer.domElement);
        //camera.position.set(0.0796859236518283, 2.466905446060931, -0.003956106766785765);
        camera.position.set(2, 1, 0.75);
        controls.target.set(0, 0, 0);
        controls.update();

        const background_color = window.getComputedStyle(canvas).backgroundColor;
        scene.background = new THREE.Color(background_color);

        // Helpers
        const axes_helper = new THREE.AxesHelper(1.5);
        axes_helper.position.y = 0.001;
        scene.add(axes_helper);
        const grid_helper = new THREE.GridHelper(30, 30);
        scene.add(grid_helper);

        //Lighting
        const ambient_light = new THREE.AmbientLight(scene.background, 2);
        scene.add(ambient_light);
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(4, 2, -1);
        scene.add(light);

        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;

        this.balls = [];
        this.jugglers = [];
    }

    //TODO method to facilitate not having to add balls to the scene

    render = (time: number): void => {
        //TODO : Who should receive the time in seconds ? ball.render also ?
        time *= 0.001; // convert time to seconds
        resizeRendererToDisplaySize(this.renderer, this.camera);

        this.balls.forEach((ball) => {
            ball.render(time);
        });
        this.jugglers.forEach((juggler) => {
            juggler.render(time);
        });

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render);
    };
}

// function create_juggler_mesh() {
//     const geometry = new THREE.CapsuleGeometry(0.5, 1.8);
//     const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
//     const juggler_mesh = new THREE.Mesh(geometry, material);
//     return juggler_mesh;
// }

export { Simulator, resizeRendererToDisplaySize };
