import Algebra from '../../template/algebra'
import AxisOperation from './operation'

export default class Minimization extends AxisOperation {
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
        this.invoke = new Function('A,B,R', [this.source, 'return R'].join('\n'))

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }

    /** Symbolic Implementation */
    start() { return `const temp = new Array(${this.of.type.size})` }

    preLoop() { return `temp.fill(Number.POSITIVE_INFINITY)` }

    inLoop() {
        return Algebra.if(
            Algebra.lessThan(this.variables.of, this.variables.temp).slice(0, 1),
            Algebra.assign(this.variables.temp, this.variables.of)
        )
    }

    postLoop() {
        return Algebra.assign(this.variables.result, this.variables.temp)
    }

    finish() { }

    /** (TODO) Pointwise Implementation */
}
