import Algebra from '../../template/algebra'
import AxisOperation from './operation'

export default class Exponential extends AxisOperation {
    constructor(args) {
        /** Defaults */
        args.axes = args.axes || []

        /** Superclass */
        super(args)

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        if (this.of.size > 0) {
            this.symbolicBoilerplate() // super class method 
            this.symbolicSourceTemplate() // super class method, utilizes helpers below
        }

        /** Create */
        this.invoke = new Function('A,B,R', this.source)
    }

    /** Symbolic Implementation */
    start() { }

    preLoop() { }

    inLoop() {
        return Algebra.assign(this.variables.result, Algebra.exp(this.variables.of))
    }

    postLoop() { }

    finish() { return 'return R' }

    /** (TODO) Pointwise Implementation */
}
