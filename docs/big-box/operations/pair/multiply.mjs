import Algebra from '../../template/algebra.mjs'
import PairOperation from './operation.mjs'

export default class Multiplication extends PairOperation {
    constructor(args) {
        /** Superclass */
        super(args)

        /** Initialize */
        this.symbolicSourceBoilerplate()
        this.symbolicSourceTemplate()

        /** Create */
        this.invoke = new Function(
            'A = this.of',
            'B = this.with',
            'R = this.result',
            [this.source, 'return R'].join('\n'))
    }

    /** Symbolic Implementation */
    start() { }

    preLoop() { }

    inLoop() {
        return Algebra.assign(this.variables.result, Algebra.multiply(this.variables.of, this.variables.with)).join('\n')
    }

    postLoop() { }

    finish() { }

    /** (TODO) Pointwise Implementation */
}
