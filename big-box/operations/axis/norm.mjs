import Tensor from '../../tensor'
import Algebra from '../../template/algebra'
import AxisOperation from './operation'

export default class Norm extends AxisOperation {
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

    /** Resultant Tensor */
    resultant() { return Tensor.zeros({ type: Tensor.Float32, shape: [] }) }

    /** Symbolic Implementation */
    start() { return `const temp = new Array(${this.of.type.size})` }

    preLoop() { return `temp.fill(0)` }

    inLoop() {
        return Algebra.assign(this.variables.temp.slice(0, 1),
            Algebra.sum(Algebra.square(this.variables.of)), '+=').slice(0, 1)
    }

    postLoop() {
        return Algebra.assign(this.variables.result, Algebra.squareRoot(this.variables.temp))
    }

    finish() { }

    /** (TODO) Pointwise Implementation */
}
