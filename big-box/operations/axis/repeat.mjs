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
        if (this.of.size > 0) {
            this.symbolicBoilerplate()
            this.symbolicSourceTemplate()
        }

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

    /** Symbolic Implementation */
    symbolicBoilerplate() {
        super.symbolicBoilerplate()

        /** Axes */
        this.axes.order = this.axes.outer.concat(this.axes.inner)
        this.axes.last = this.axes.order[this.axes.order.length - 1]
        this.axes.repeat = this.axes.inner[0] || this.axes.last

        /** Strides */
        this.strides.R = this.result.strides

        /** Scalars */
        this.scalars.R = this.axes.total.map(Source.prefix)
        this.scalars.R[this.axes.repeat] = 'r'

        /** Indices */
        this.indices.result = Source.index('RIndex', this.scalars.R, this.strides.R, this.result.offset)

        /** Loops */
        this.loops.count = Source.loop([`let r = i${this.axes.last}*${this.count}, c = 0`], [`c < ${this.count}`], ['r++, c++'])
    }

    symbolicSourceTemplate() {
        this.source = [
            ...this.loops.outer,
            ...this.loops.inner,

            this.indices.of,
            this.loops.count,
            this.indices.result,

            Algebra.assign(this.variables.result, this.variables.of),

            `}`,
            `}`.repeat(this.loops.inner.length),
            `}`.repeat(this.loops.outer.length),
        ].join('\n')
    }

    /** (TODO) Pointwise Implementation */
}
