
export default class Cache {
    constructor(methods) {
        this.suite = {}
        this.methods = methods
    }

    invoke(A, B, R, axes, method) {
        let func

        try {
            (func = this.suite[A.id][B.id][R.id][method]).name
        }

        catch (error) {
            func = (((this.suite[A.id] = {})[B.id] = {})[R.id] = {})[method]
                = this.methods[method].create(A, B, R, axes)
        }

        return func(A, B, R, axes)
    }
}
