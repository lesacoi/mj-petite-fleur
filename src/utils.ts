import * as THREE from "three";
import { CubicHermiteSpline } from "./Spline";

function V3ADD(a: THREE.Vector3, b: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
}

function V3SUB(a: THREE.Vector3, b: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
}

function V3MUL(a: THREE.Vector3, b: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
}

function V3SCA(scalar: number, a: THREE.Vector3): THREE.Vector3 {
    return new THREE.Vector3(scalar * a.x, scalar * a.y, scalar * a.z);
}

/**
 * Given points for a shoulder and a hand, and the length of the arm and forearm, returns the position of the elbow that satisfies those constraints. The solutions make a circle, so we return the solution closest to the position closest_to.
 * @param S Location of the shoulder S.
 * @param H Location of the hand H.
 * @param SE_dist Length of the arm.
 * @param EH_dist Length of the forearm.
 * @param T Point to which the solution will be closest (the target T).
 */
function find_elbow(
    S: THREE.Vector3,
    H: THREE.Vector3,
    SE_dist: number,
    EH_dist: number,
    T: THREE.Vector3
) {
    // The solutions make a circle centered on C, of radius r.
    const SH_dist = V3SUB(H, S).length();
    const SH_unit = V3SUB(H, S).normalize();
    const SC_dist = (SE_dist ** 2 - EH_dist ** 2 + SH_dist ** 2) / (2 * SH_dist);
    const r = Math.sqrt(SE_dist ** 2 - SC_dist ** 2);
    const C = V3ADD(S, V3SCA(SC_dist, SH_unit));
    const Tproj = V3ADD(C, V3SUB(T, C).projectOnPlane(SH_unit));
    const CTproj_unit = V3SUB(Tproj, C).normalize();
    const E = V3ADD(C, V3SCA(r, CTproj_unit));
    return E;
}

class SplineThree extends THREE.Curve<THREE.Vector3> {
    readonly type = "SplineThree";
    spline: CubicHermiteSpline<THREE.Vector3>;

    constructor(spline: CubicHermiteSpline<THREE.Vector3>) {
        super();
        this.spline = spline;
    }

    getPoint(t: number, optionalTarget?: THREE.Vector3): THREE.Vector3 {
        if (optionalTarget === undefined) {
            optionalTarget = new THREE.Vector3();
        }
        const t_start = this.spline.knots[0];
        const t_end = this.spline.knots[this.spline.knots.length - 1];
        const t_nor = (t - t_start) / (t_end - t_start);
        optionalTarget.copy(this.spline.interpolate(t_nor));
        return optionalTarget;
    }
    //Comme vu dans CubicBezierCurve.js de threejs, faire méthode copy, toJSON et fromJSON ?
}

export { V3ADD, V3SUB, V3MUL, V3SCA, SplineThree, find_elbow };
