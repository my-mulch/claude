import PairOperation from './operation'
import PairOperationFactory from './factory'

export default {
    add: PairOperationFactory(Algebra.add),
    divide: PairOperationFactory(Algebra.divide),
    subtract: PairOperationFactory(Algebra.subtract),
    multiply: PairOperationFactory(Algebra.multiply),

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

