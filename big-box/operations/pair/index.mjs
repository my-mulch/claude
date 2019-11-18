import PairOperation from './operation'
import PairOperationFactory from './factory'

export default {
    add: PairOperationFactory(Algebra.add),
    subtract: PairOperationFactory(Algebra.subtract),
    multiply: PairOperationFactory(Algebra.multiply),

    divide: class extends PairOperation {
        constructor(args) {
            const A = args.of.slice({ region: args.region || [] })
            super({ ...args, of: A, result: A }, {
                inner: function () {
                    return Algebra.divide(
                        this.variables.result,
                        this.variables.of,
                        this.variables.with)
                },
                after: function () { return 'return R' }
            })
        }
    },

    assign: class extends PairOperation {
        constructor(args) {
            const A = args.of.slice({ region: args.region || [] })
            super({ ...args, of: A, result: A }, {
                before: function () { return this.original = args.of },
                inner: function () { return Algebra.assign(this.variables.of, this.variables.with) },
                after: function () { return 'return this.original' }
            })
        }
    }
}
