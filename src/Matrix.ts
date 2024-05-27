export type Structure<Elem, Scalar> = {
    add: (a: Elem, b: Elem) => Elem;
    multiply: (a: Elem, b: Elem) => Elem;
    multiply_by_scalar: (scalar: Scalar, a: Elem) => Elem;
    zero: Elem;
};

// TODO : Deep Copy the operations ?
// Handle what is private / public ?
// How to properly handle smae type but different structure ?
// custom copy element function instead of structured clone ?
// Multiply scalar is not really a scalar multiplication ?
// No check when passing data to see if matrix is rectangular.
// Make multiplication more general base on custom multiplication : (a: T, b: U): V => a*b
// Scalar is "just a one by one matrix"

class Matrix<T, S> {
    data: T[][];
    nb_row: number;
    nb_col: number;
    add_T: (a: T, b: T) => T;
    multiply_T: (a: T, b: T) => T;
    multiply_by_scalar_T: (scalar: S, a: T) => T;
    structure: Structure<T, S>;

    constructor(data: T[][], structure: Structure<T, S>) {
        this.data = data;
        this.nb_row = this.data.length;
        if (this.nb_row === 0) {
            this.nb_col = 0;
        } else {
            this.nb_col = this.data[0].length;
        }
        this.add_T = structure.add;
        this.multiply_T = structure.multiply;
        this.multiply_by_scalar_T = structure.multiply_by_scalar;
        this.structure = structure;
    }

    static by_shape<T, S>(
        nb_row: number,
        nb_col: number,
        init_value: T,
        structure: Structure<T, S>
    ): Matrix<T, S> {
        const data: T[][] = Array<T[]>(nb_row);
        for (let i = 0; i < nb_row; i++) {
            data[i] = Array<T>(nb_col);
            for (let j = 0; j < nb_col; j++) {
                data[i][j] = structuredClone(init_value);
            }
        }
        return new Matrix<T, S>(data, structure);
    }

    static zeros<T, S>(nb_row: number, nb_col: number, structure: Structure<T, S>): Matrix<T, S> {
        return Matrix.by_shape(nb_row, nb_col, structure.zero, structure);
    }

    static zeros_like<T, S>(mat: Matrix<T, S>): Matrix<T, S> {
        return Matrix.by_shape(mat.nb_row, mat.nb_col, mat.structure.zero, mat.structure);
    }

    copy(): Matrix<T, S> {
        return new Matrix(structuredClone(this.data), this.structure);
    }

    get(row: number, col: number): T {
        return this.data[row][col];
    }

    set(row: number, col: number, value: T): void {
        this.data[row][col] = value;
    }

    stringify_coords(): string {
        return `${this.nb_row} * ${this.nb_col}`;
    }

    add(other: Matrix<T, S>): Matrix<T, S> {
        if (this.nb_row !== other.nb_row || this.nb_col !== other.nb_col) {
            throw new Error(
                `Can't add matrix of size ${this.stringify_coords()} and ${other.stringify_coords()}`
            );
        }
        const res = Matrix.zeros_like(this);
        for (let i = 0; i < res.nb_row; i++) {
            for (let j = 0; j < res.nb_col; j++) {
                res.data[i][j] = res.add_T(this.data[i][j], other.data[i][j]);
            }
        }
        return res;
    }

    multiply(other: Matrix<T, S>): Matrix<T, S> {
        if (this.nb_col !== other.nb_row) {
            throw new Error(
                `Can't multiply matrix of size ${this.stringify_coords()} and ${other.stringify_coords()}`
            );
        }
        const res = Matrix.zeros(this.nb_row, other.nb_col, other.structure);
        for (let i = 0; i < res.nb_row; i++) {
            for (let j = 0; j < res.nb_col; j++) {
                for (let k = 0; k < this.nb_col; k++) {
                    res.data[i][j] = res.add_T(
                        res.data[i][j],
                        res.multiply_T(this.data[i][k], other.data[k][j])
                    );
                }
            }
        }
        return res;
    }

    multiply_by_scalar(scalar: S): Matrix<T, S> {
        const res = Matrix.zeros_like(this);
        for (let i = 0; i < res.nb_row; i++) {
            for (let j = 0; j < res.nb_col; j++) {
                res.data[i][j] = res.multiply_by_scalar_T(scalar, this.data[i][j]);
            }
        }
        return res;
    }

    static add<T, S>(mat1: Matrix<T, S>, mat2: Matrix<T, S>): Matrix<T, S> {
        return mat1.add(mat2);
    }

    static multiply<T, S>(mat1: Matrix<T, S>, mat2: Matrix<T, S>): Matrix<T, S> {
        return mat1.multiply(mat2);
    }

    static multiply_by_scalar<T, S>(scalar: S, mat: Matrix<T, S>): Matrix<T, S>;
    static multiply_by_scalar<T, S>(mat: Matrix<T, S>, scalar: S): Matrix<T, S> {
        return mat.multiply_by_scalar(scalar);
    }

    static multiply_matrix_of_scalars_by_matrix<T, S>(scalar_mat: Matrix<S, S>, mat: Matrix<T, S>) {
        if (scalar_mat.nb_col !== mat.nb_row) {
            throw new Error(
                `Can't multiply matrix of size ${scalar_mat.stringify_coords()} and ${mat.stringify_coords()}`
            );
        }
        const res = Matrix.zeros(scalar_mat.nb_row, mat.nb_col, mat.structure);
        for (let i = 0; i < res.nb_row; i++) {
            for (let j = 0; j < res.nb_col; j++) {
                for (let k = 0; k < scalar_mat.nb_col; k++) {
                    res.data[i][j] = res.add_T(
                        res.data[i][j],
                        res.multiply_by_scalar_T(scalar_mat.data[i][k], mat.data[k][j])
                    );
                }
            }
        }
        return res;
    }
}

export { Matrix };
