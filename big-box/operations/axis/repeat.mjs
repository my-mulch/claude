import Tensor from '../../tensor'
import Header from '../../header'
import Algebra from '../../algebra'
import Template from '../../template'

export default class Repeat {
    constructor(args) {
        /** Repeat count */
        this.count = args.count || 1

        /** Axes */
        this.axes = {}
        this.axes.inner = args.axes || []
        this.axes.total = [...args.of.shape.keys()]
        this.axes.outer = Tensor.difference(this.axes.total, this.axes.inner)
        this.axes.order = this.axes.outer.concat(this.axes.inner)
        this.axes.last = this.axes.order[this.axes.order.length - 1]
        this.axes.repeat = this.axes.inner[0] || this.axes.last

        /** Tensors */
        this.tensors = {}
        this.tensors.A = args.of
        this.tensors.R = args.result || this.resultant()

        /** Dimensions */
        this.dimensions = {}
        this.dimensions.A = Header.strides(this.tensors.A.shape, this.tensors.A.type)
        this.dimensions.R = Header.strides(this.tensors.R.shape, this.tensors.R.type)

        /** Loops */
        this.loops = {}
        this.loops.outer = Template.loopAxes(this.axes.outer, this.tensors.A)
        this.loops.inner = Template.loopAxes(this.axes.inner, this.tensors.A)
        this.loops.count = Template.loop([`let r = i${this.axes.last}*${this.count}, c = 0`], [`c < ${this.count}`], ['r++, c++'])

        /** Strides */
        this.strides = {}
        this.strides.A = this.tensors.A.strides
        this.strides.R = this.tensors.R.strides

        /** Scalars */
        this.scalars = {}
        this.scalars.A = this.axes.total.map(Template.prefix)
        this.scalars.R = this.axes.total.map(Template.prefix)
        this.scalars.R[this.axes.repeat] = 'r'

        /** Indices */
        this.indices = {}
        this.indices.A = Template.index('AIndex', this.scalars.A, this.strides.A, this.tensors.A.offset)
        this.indices.R = Template.index('RIndex', this.scalars.R, this.strides.R, this.tensors.R.offset)

        /** Variables */
        this.variables = {}
        this.variables.A = Algebra.variable({ symbol: 'this.tensors.A.data', index: 'AIndex', size: this.tensors.A.type.size })
        this.variables.R = Algebra.variable({ symbol: 'this.tensors.R.data', index: 'RIndex', size: this.tensors.R.type.size })

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
