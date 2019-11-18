import Tensor from '../../../tensor'
import Source from '../../../template/source'
import Algebra from '../../../template/algebra'

import AxisOperation from '../operation'

export default {
    repeat: class Repeat extends AxisOperation {
        constructor(args) {
            super(args)

            this.count = args.count || 1

            this.axes.order = this.axes.outer.concat(this.axes.inner)
            this.axes.last = this.axes.order[this.axes.order.length - 1]
            this.axes.repeat = this.axes.inner[0] || this.axes.last

            this.result = args.result || this.resultant()
            this.strides.R = this.result.strides

            this.scalars.R = this.axes.total.map(Source.prefix)
            this.scalars.R[this.axes.repeat] = 'r'

            this.indices.result = Source.index('RIndex', this.scalars.R, this.strides.R, this.result.offset)

            this.loops.count = Source.loop([`let r = i${this.axes.last}*${this.count}, c = 0`], [`c < ${this.count}`], ['r++, c++'])

            this.invoke = new Function('A,B,R', [
                ...this.loops.outer,
                ...this.loops.inner,

                this.indices.of,
                this.loops.count,
                this.indices.result,

                Algebra.assign(this.variables.result, this.variables.of),

                `}`,
                `}`.repeat(this.loops.inner.length),
                `}`.repeat(this.loops.outer.length),

                `return R`

            ].join('\n'))

            if (!args.template)
                this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
        }

        resultant() {
            return Tensor.zeros({
                type: this.of.type,
                shape: this.of.shape.map(function (value, axis) {
                    return axis === this.axes.repeat ? this.count * value : value
                }, this)
            })
        }
    }
}
