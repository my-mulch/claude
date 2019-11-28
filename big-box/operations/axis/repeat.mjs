import Tensor from '../../tensor'
import Source from '../../template/source'
import Algebra from '../../template/algebra'
import AxisOperation from './operation'

export default class Repeat extends AxisOperation {
    constructor(args) {
        /** Defaults */
        args.axes = args.axes || [args.of.shape.length - 1]

        /** Superclass */
        super(args)

        /** Properties */
        this.count = args.count || 1

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        this.symbolicSourceBoilerplate()
        this.symbolicSourceTemplate()

        /** Create */
        this.invoke = new Function('A,B,R', [this.source, 'return R'].join('\n'))

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }

    resultant() {
        return Tensor.zeros({
            type: this.of.type,
            shape: this.of.shape.map(function (value, axis) {
                return axis === this.axes.inner[0] ? this.count * value : value
            }, this)
        })
    }

    /** 
     * 
     * 
     * Symbolic Implementation 
     * 
     * 
     * */

    symbolicSourceBoilerplate() {
        /** Axes */
        this.axes.of = this.of.header.nonZeroAxes(this.axes.total)
        this.axes.with = this.with.header.nonZeroAxes(this.axes.total)
        this.axes.result = this.result.header.nonZeroAxes(this.axes.total).set(`i${this.axes.last}`, `r`)

        super.symbolicSourceBoilerplate()
    }

    start() { }
    preLoop() { }

    inLoop() {
        return new Source([
            this.indices.of,

            new Source()
                .for(`let r = i${this.axes.last}*${this.count}, c = 0`, `c < ${this.count}`, 'r++, c++')
                .then([
                    this.indices.result,
                    Algebra.assign(this.variables.result, this.variables.of)
                ])
        ])
    }

    postLoop() { }
    finish() { }

    /** 
     * 
     * 
     * (TODO) Literal Implementation 
     * 
     * 
     * */
}
