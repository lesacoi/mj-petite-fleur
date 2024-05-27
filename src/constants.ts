import { Structure } from "./Matrix";
import * as THREE from "three";

export const GRAVITY = 9.81;
export const NUMBERS_STRUCTURE: Structure<number, number> = {
    add: (a: number, b: number) => a + b,
    multiply: (a: number, b: number) => a * b,
    multiply_by_scalar: (scalar: number, a: number) => scalar * a,
    zero: 0
};
export const VECTOR3_STRUCTURE: Structure<THREE.Vector3, number> = {
    add: (a: THREE.Vector3, b: THREE.Vector3) => new THREE.Vector3(a.x + b.x, a.y + b.y, a.z + b.z),
    multiply: (a: THREE.Vector3, b: THREE.Vector3) =>
        new THREE.Vector3(a.x * b.x, a.y * b.y, a.z * b.z),
    multiply_by_scalar: (scalar: number, a: THREE.Vector3) =>
        new THREE.Vector3(scalar * a.x, scalar * a.y, scalar * a.z),
    zero: new THREE.Vector3(0, 0, 0)
};
