import { Matrix, Structure } from "./Matrix";
import { createRBTree, RBTree } from "./RBTree";
import { NUMBERS_STRUCTURE } from "./constants";

//TODO : Assumes at least 1 element.
//TODO : To geneeralize to splines, rename points by parameter ?

class CubicHermiteSpline<T> {
    points: T[];
    dpoints: T[];
    knots: number[];
    tree: RBTree<number, number>;
    structure: Structure<T, number>;

    constructor(structure: Structure<T, number>, points: T[], dpoints: T[], knots?: number[]) {
        if (points.length !== dpoints.length) {
            throw new Error("The number of points and derivatives should be the same.");
        }
        this.points = points;
        this.dpoints = dpoints;

        if (typeof knots === "undefined") {
            this.knots = new Array<number>(this.points.length);
            for (let i = 0; i < this.knots.length; i++) {
                this.knots[i] = i;
            }
        } else {
            if (points.length !== knots.length) {
                throw new Error("Points and knots must have the same size");
            }
            this.knots = knots;
        }

        let tree: RBTree<number, number> = createRBTree();
        for (let i = 0; i < this.points.length; i++) {
            tree = tree.insert(this.knots[i], i);
        }
        this.tree = tree;

        this.structure = structure;
    }

    prev_next_time_idx(time: number): {
        prev_time: number;
        next_time: number;
        prev_idx: number;
        next_idx: number;
    } {
        // Handle cases where time outside of knots range.
        //TODO : DO that after the prev/next it have ben computed ?
        if (time < this.knots[0]) {
            time = this.knots[0];
        } else if (time > this.knots[this.knots.length - 1]) {
            time = this.knots[this.knots.length - 1];
        }

        // Interpolate value.
        const prev_it = this.tree.le(time);
        const next_it = this.tree.ge(time);
        const prev_time = prev_it.key;
        const prev_idx = prev_it.value;
        const next_time = next_it.key;
        const next_idx = next_it.value;
        // Sanity Check.
        if (
            prev_time === undefined ||
            next_time === undefined ||
            prev_idx === undefined ||
            next_idx === undefined
        ) {
            throw new Error("Something went wrong...");
        }
        return {
            prev_time: prev_time,
            next_time: next_time,
            prev_idx: prev_idx,
            next_idx: next_idx
        };
    }

    get_transformation_matrix(dt: number): Matrix<number, number> {
        const transformation_data = [
            [2, -2, dt, dt],
            [-3, 3, -2 * dt, dt],
            [0, 0, 1, 0],
            [1, 0, 0, 0]
        ];
        return new Matrix<number, number>(transformation_data, NUMBERS_STRUCTURE);
    }

    get_param_matrix(prev_idx: number, next_idx: number) {
        const param_data = [
            [this.points[prev_idx]],
            [this.points[next_idx]],
            [this.dpoints[prev_idx]],
            [this.dpoints[next_idx]]
        ];
        return new Matrix<T, number>(param_data, this.structure);
    }

    interpolate(time: number): T {
        const { prev_time, next_time, prev_idx, next_idx } = this.prev_next_time_idx(time);

        // Creating transformation matrix
        const dt = next_time - prev_time;
        const transformation_mat = this.get_transformation_matrix(dt);
        // Creating parameters vector
        const param_mat = this.get_param_matrix(prev_idx, next_idx);
        // Creating vector of times
        const time_nor = (time - prev_time) / (next_time - prev_time);
        const times_data = [[time_nor ** 3, time_nor ** 2, time_nor ** 1, time_nor ** 0]];
        const times_mat = new Matrix<number, number>(times_data, NUMBERS_STRUCTURE);

        // Computing the interpolation. Result has only 1 element
        const res = Matrix.multiply_matrix_of_scalars_by_matrix(
            times_mat.multiply(transformation_mat),
            param_mat
        );
        return res.data[0][0];
    }

    velocity(time: number): T {
        const { prev_time, next_time, prev_idx, next_idx } = this.prev_next_time_idx(time);

        // Creating transformation matrix
        const dt = next_time - prev_time;
        const transformation_mat = this.get_transformation_matrix(dt);
        // Creating parameters vector
        const param_mat = this.get_param_matrix(prev_idx, next_idx);
        // Creating vector of times
        const time_nor = (time - prev_time) / (next_time - prev_time);
        const times_data = [[3 * time_nor ** 2, 2 * time_nor, 1, 0]];
        const times_mat = new Matrix<number, number>(times_data, NUMBERS_STRUCTURE);

        // Computing the interpolation. Result has only 1 element
        const res = Matrix.multiply_matrix_of_scalars_by_matrix(
            times_mat.multiply(transformation_mat),
            param_mat
        );
        return res.data[0][0];
    }
}

// /**
//  * Interpolates the non uniform cubic hermite spline given the following :
//  * @param pos0 the initial value.
//  * @param dpos0 the velocity at that first value.
//  * @param t0 the time at that first value.
//  * @param pos1 the final value.
//  * @param dpos1 the velocity at that final value.
//  * @param t1 the time at that final value.
//  * @param t the time (between t0 and t1) to interpolate.
//  * @returns the interpolated value.
//  */
// function cubic_hermite_spline<T extends math.Matrix | >(
//     pos0: math.Matrix,
//     dpos0: math.Matrix,
//     t0: number,
//     pos1: math.Matrix,
//     dpos1: math.Matrix,
//     t1: number,
//     t: number
// ): math.Matrix {
//     const dt = t1 - t0;
//     const mat = math.matrix([
//         [2, -2, dt, dt],
//         [-3, 3, -2 * dt, dt],
//         [0, 0, 1, 0],
//         [1, 0, 0, 0]
//     ]);
//     const params_mat = [pos0, pos1, dpos0, dpos1];
//     const t_nor = (t - t0) / (t1 - t0);
//     const times_mat = math.matrix([t_nor ** 3, t_nor ** 2, t_nor ** 1, t_nor ** 0]);
//     return multiply_matrix_of_scalars_by_vector_of_matrices(
//         math.multiply(times_mat, mat),
//         params_mat
//     )[0];
// }

// function three_vector3_to_matjs_matrix(vec: THREE.Vector3Like): math.Matrix {
//     return math.matrix([vec.x, vec.y, vec.z]);
// }

// function matjs_matrix_to_three_vector3(mat: math.Matrix): THREE.Vector3 {
//     return new THREE.Vector3(
//         mat.get([0]) as number,
//         mat.get([1]) as number,
//         mat.get([2]) as number
//     );
// }

export { CubicHermiteSpline };
