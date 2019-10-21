
export default class Cache {
    constructor(methods) {
        this.suite = {}
        this.methods = methods
    }

    invoke(A, B, R, meta, method) {
        let func, loc

        try {
            (func = this.suite[A.id][B.id][R.id][method]).name
        }

        catch (error) {
            func = (((this.suite[A.id] = {})[B.id] = {})[R.id] = {})[method] = this.methods[method].test(A, B, R, meta)
        }

        return func(A, B, R, meta)
    }
}
