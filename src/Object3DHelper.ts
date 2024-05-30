import { AxesHelper, Mesh, SphereGeometry, MeshBasicMaterial, Group } from "three";

class Object3DHelper extends Group {
    constructor(show_point = true, color: number | string = 0x000000, show_axes = true) {
        super();
        if (show_point) {
            const geometry = new SphereGeometry(0.1, 4, 2);
            const material = new MeshBasicMaterial({
                wireframe: true,
                fog: false,
                toneMapped: false,
                color: color
            });
            const mesh = new Mesh(geometry, material);
            this.add(mesh);
        }
        if (show_axes) {
            const axes = new AxesHelper(0.15);
            this.add(axes);
        }
    }
}

export { Object3DHelper };
