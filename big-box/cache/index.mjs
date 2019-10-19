export default class Cache {
    constructor(methods) {
        this.suite = {}
        this.methods = methods
    }

    invoke(A, B, R, meta, method) {
        let func

        try {
            (func = this.suite[A.id][B.id][R.id][method]).name
        } catch{
            this.suite[A.id] = {}
            this.suite[A.id][B.id] = {}
            this.suite[A.id][B.id][R.id] = {}
            this.suite[A.id][B.id][R.id][method] = this.methods[method].test(A, B, R, meta)

            func = this.suite[A.id][B.id][R.id][method]
        }

        return func(A, B, R, meta)
    }
}
