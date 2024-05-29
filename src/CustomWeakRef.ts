// Custom WeakRef class to offset Eslint's complaints about weakref.
class CWeakRef<T extends WeakKey> {
    private _ref: WeakRef<T>;

    constructor(ref: T) {
        // eslint-disable-next-line
        this._ref = new WeakRef<T>(ref);
    }

    deref(): T | undefined {
        // eslint-disable-next-line
        return this._ref.deref();
    }
}

export { CWeakRef };
