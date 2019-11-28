import Algebra from '../../template/algebra.mjs'
import PairOperation from './operation.mjs'

export default class Multiplication extends PairOperation {
    constructor(args) {
        /** Superclass */
        super(args)

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        super.symbolicBoilerplate()
        super.symbolicSourceTemplate()

        /** Create */
        this.invoke = new Function('A,B,R', [this.source, 'return R'].join('\n'))

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }

    /** Symbolic Implementation */
    start() { }

    preLoop() { }

    inLoop() {
        return Algebra.assign(this.variables.result, Algebra.multiply(this.variables.of, this.variables.with))
    }

    postLoop() { }

    finish() { }

    /** (TODO) Pointwise Implementation */
}
