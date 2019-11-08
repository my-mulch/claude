import Tensor from '../../tensor'
import Algebra from '../../algebra'
import Template from '../../template'

import AxisOperation from './operation'

export default class Repeat extends AxisOperation {
    constructor(args) {
        super(args)
        
        this.count = args.count || 1
        
        this.axes.order = this.axes.outer.concat(this.axes.inner)
        this.axes.last = this.axes.order[this.axes.order.length - 1]
        this.axes.repeat = this.axes.inner[0] || this.axes.last

        this.tensors.R = args.result || this.resultant()
        
        this.loops.count = Template.loop([`let r = i${this.axes.last}*${this.count}, c = 0`], [`c < ${this.count}`], ['r++, c++'])
        
        this.scalars.R = this.axes.total.map(Template.prefix)
        this.scalars.R[this.axes.repeat] = 'r'

        this.indices.R = Template.index('RIndex', this.scalars.R, this.strides.R, this.tensors.R.offset)

        this.invoke = new Function([
            ...this.loops.outer,
            ...this.loops.inner,

            this.indices.A,
            this.loops.count,
            this.indices.R,

            Algebra.assign(this.variables.R, this.variables.A),

            `}`,
            `}`.repeat(this.loops.inner.length),
            `}`.repeat(this.loops.outer.length),

            `return this.tensors.R`

        ].join('\n')).bind(this)
    }

    resultant() {
        return Tensor.zeros({
            type: this.tensors.A.type,
            shape: this.tensors.A.shape.map(function (value, axis) {
                return axis === this.axes.repeat ? this.count * value : value
            }, this)
        })
    }
}
