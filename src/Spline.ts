import { Matrix, Structure } from "./Matrix";
import { createRBTree, RBTree } from "./RBTree";
import { NUMBERS_STRUCTURE } from "./constants";

//TODO : To geneeralize to splines, rename points by parameter ?
//TODO : Rewrite for threejs ?

abstract class Spline<T> {
    abstract knots: number[];
    abstract tree: RBTree<number, number>;
    abstract structure: Structure<T, number>;

    // constructor(structure: Structure<T, number>) {
    //     // if (parameters.length === 0) {
    //     //     throw new Error("A spline should have at least one set of parameters.");
    //     // }

    //     // this.parameters = parameters;
    //     this.structure = structure;

    //     // if (knots === undefined) {
    //     //     this.knots = new Array<number>(this.parameters.length);
    //     //     for (let i = 0; i < this.knots.length; i++) {
    //     //         this.knots[i] = i;
    //     //     }
    //     // } else if (this.parameters.length !== knots.length) {
    //     //     throw new Error("Points and knots must have the same size");
    //     // } else {
    //     //     this.knots = knots;
    //     // }

    //     // let tree: RBTree<number, number> = createRBTree();
    //     // for (let i = 0; i < this.parameters.length; i++) {
    //     //     tree = tree.insert(this.knots[i], i);
    //     // }
    //     // this.tree = tree;
    // }

    prev_next_time_idx(time: number): {
        prev_time: number;
        next_time: number;
        prev_idx: number;
        next_idx: number;
    } {
        if (time < this.knots[0]) {
            time = this.knots[0];
        } else if (time > this.knots[this.knots.length - 1]) {
            time = this.knots[this.knots.length - 1];
        }

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

    abstract get_transformation_matrix(dt?: number): Matrix<number, number>;

    abstract get_param_matrix(prev_idx: number, next_idx: number, dt?: number): Matrix<T, number>;

    interpolate(time: number): T {
        const { prev_time, next_time, prev_idx, next_idx } = this.prev_next_time_idx(time);

        // Creating transformation matrix
        const dt = next_time - prev_time;
        const transformation_mat = this.get_transformation_matrix(dt);

        // Creating parameters vector
        const param_mat = this.get_param_matrix(prev_idx, next_idx, dt);

        // Creating vector of times
        const time_nor = next_idx === prev_idx ? 0 : (time - prev_time) / dt;
        const degree = transformation_mat.nb_row;
        const times_data = Array<number>(degree);
        for (let i = 0; i < times_data.length; i++) {
            times_data[i] = time_nor ** (degree - 1 - i);
        }
        const times_mat = new Matrix<number, number>([times_data], NUMBERS_STRUCTURE);

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
        const param_mat = this.get_param_matrix(prev_idx, next_idx, dt);

        // Creating vector of times
        const time_nor = next_idx === prev_idx ? 0 : (time - prev_time) / dt;
        const degree = transformation_mat.nb_row;
        const times_data = Array<number>(degree);
        for (let i = 0; i < times_data.length - 1; i++) {
            times_data[i] = time_nor ** (degree - 2 - i);
        }
        times_data[times_data.length - 1] = 0;
        const times_mat = new Matrix<number, number>([times_data], NUMBERS_STRUCTURE);

        // Computing the interpolation. Result has only 1 element
        const res = Matrix.multiply_matrix_of_scalars_by_matrix(
            times_mat.multiply(transformation_mat),
            param_mat
        );
        return res.data[0][0];
    }
}

class CubicHermiteSpline<T> extends Spline<T> {
    points: T[];
    dpoints: T[];
    knots: number[];
    tree: RBTree<number, number>;
    structure: Structure<T, number>;
    private static _transformation_matrix = new Matrix<number, number>(
        [
            [2, -2, 1, 1],
            [-3, 3, -2, -1],
            [0, 0, 1, 0],
            [1, 0, 0, 0]
        ],
        NUMBERS_STRUCTURE
    );

    constructor(structure: Structure<T, number>, points: T[], dpoints: T[], knots?: number[]) {
        super();
        if (points.length !== dpoints.length) {
            throw new Error("The number of points and derivatives should be the same.");
        }
        this.points = points;
        this.dpoints = dpoints;

        if (knots === undefined) {
            this.knots = new Array<number>(this.points.length);
            for (let i = 0; i < this.knots.length; i++) {
                this.knots[i] = i;
            }
        } else if (points.length !== knots.length) {
            throw new Error("Points and knots must have the same size");
        } else {
            this.knots = knots;
        }

        let tree: RBTree<number, number> = createRBTree();
        for (let i = 0; i < this.points.length; i++) {
            tree = tree.insert(this.knots[i], i);
        }
        this.tree = tree;

        this.structure = structure;
    }

    get_transformation_matrix(): Matrix<number, number> {
        return CubicHermiteSpline._transformation_matrix;
    }

    get_param_matrix(prev_idx: number, next_idx: number, dt: number) {
        const param_data = [
            [this.points[prev_idx]],
            [this.points[next_idx]],
            [this.structure.multiply_by_scalar(dt, this.dpoints[prev_idx])],
            [this.structure.multiply_by_scalar(dt, this.dpoints[next_idx])]
        ];
        return new Matrix<T, number>(param_data, this.structure);
    }
}

class QuniticHermiteSpline<T> extends Spline<T> {
    points: T[];
    dpoints: T[];
    apoints: T[];
    knots: number[];
    tree: RBTree<number, number>;
    structure: Structure<T, number>;
    private static _transformation_matrix = new Matrix<number, number>(
        [
            [-6, 6, -3, -3, -1 / 2, 1 / 2],
            [15, -15, 8, 7, 3 / 2, -1],
            [-10, 10, -6, -4, -3 / 2, 1 / 2],
            [0, 0, 0, 0, 1 / 2, 0],
            [0, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0, 0]
        ],
        NUMBERS_STRUCTURE
    );

    constructor(
        structure: Structure<T, number>,
        points: T[],
        dpoints: T[],
        apoints: T[],
        knots?: number[]
    ) {
        super();
        if (points.length !== dpoints.length || points.length !== apoints.length) {
            throw new Error("The number of points and derivatives should be the same.");
        }
        this.points = points;
        this.dpoints = dpoints;
        this.apoints = apoints;

        if (knots === undefined) {
            this.knots = new Array<number>(this.points.length);
            for (let i = 0; i < this.knots.length; i++) {
                this.knots[i] = i;
            }
        } else if (points.length !== knots.length) {
            throw new Error("Points and knots must have the same size");
        } else {
            this.knots = knots;
        }

        let tree: RBTree<number, number> = createRBTree();
        for (let i = 0; i < this.points.length; i++) {
            tree = tree.insert(this.knots[i], i);
        }
        this.tree = tree;

        this.structure = structure;
    }

    get_transformation_matrix(): Matrix<number, number> {
        return QuniticHermiteSpline._transformation_matrix;
    }

    get_param_matrix(prev_idx: number, next_idx: number, dt: number) {
        const param_data = [
            [this.points[prev_idx]],
            [this.points[next_idx]],
            [this.structure.multiply_by_scalar(dt, this.dpoints[prev_idx])],
            [this.structure.multiply_by_scalar(dt, this.dpoints[next_idx])],
            [this.structure.multiply_by_scalar(dt ** 2, this.apoints[next_idx])],
            [this.structure.multiply_by_scalar(dt ** 2, this.apoints[prev_idx])]
        ];
        return new Matrix<T, number>(param_data, this.structure);
    }
}

export { CubicHermiteSpline, QuniticHermiteSpline };
