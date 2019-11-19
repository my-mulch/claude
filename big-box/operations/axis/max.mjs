import Algebra from '../../template/algebra'
import AxisOperation from './operation'

export default class Maximization extends AxisOperation {
    constructor(args) {
        /** Defaults */
        args.axes = args.axes || [...args.of.shape.keys()]

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
    start() { return `const temp = new Array(${this.of.type.size})` }

    preLoop() { return `temp.fill(Number.NEGATIVE_INFINITY)` }

    inLoop() {
        return Algebra.if(
            Algebra.greaterThan(this.variables.of, this.variables.temp).slice(0, 1),
            Algebra.assign(this.variables.temp, this.variables.of)
        )
    }

    postLoop() {
        return Algebra.assign(this.variables.result, this.variables.temp)
    }

    finish() { return 'return R' }

    /** (TODO) Pointwise Implementation */
}
