
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
            body = this.methods[method].create(A, B, R, axes)
            func = (((this.suite[A.id] = {})[B.id] = {})[R.id] = {})[method]
                = new Function('A,B,R', `${body}; return R`)
        }

        return func(A, B, R, axes)
    }
}
