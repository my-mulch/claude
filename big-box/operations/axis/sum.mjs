import Algebra from '../../template/algebra'
import AxisOperation from './operation'

export default class Summation extends AxisOperation {
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

    preLoop() { return `temp.fill(0)` }

    inLoop() {
        return Algebra.assign(this.variables.temp, this.variables.of, '+=')
    }

    postLoop() {
        return Algebra.assign(this.variables.result, this.variables.temp)
    }

    finish() { return 'return R' }

    /** (TODO) Pointwise Implementation */
}
