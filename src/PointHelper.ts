import { Object3D, AxesHelper, Mesh, SphereGeometry, MeshBasicMaterial } from "three";

class Object3DHelper {
    mesh?: Mesh;
    axes?: AxesHelper;
    constructor(obj: Object3D, show_point = true, color = 0x000000, show_axes = true) {
        if (show_point) {
            const geometry = new SphereGeometry(0.1, 4, 2);
            const material = new MeshBasicMaterial({
                wireframe: true,
                fog: false,
                toneMapped: false,
                color: color
            });
            const mesh = new Mesh(geometry, material);
            this.mesh = mesh;
            obj.add(mesh);
        }
        if (show_axes) {
            const axes = new AxesHelper(0.15);
            this.axes = axes;
            obj.add(axes);
        }
    }
}

export { Object3DHelper };
