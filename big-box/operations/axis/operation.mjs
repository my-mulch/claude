import Tensor from '../../tensor'
import Algebra from '../../algebra'
import Template from '../../template'

export default class ElementOperation {
    constructor(args) {
        /** Inputs */
        this.tensors = {}
        this.tensors.A = Tensor.tensor({ data: args.of })

        /** Axes */
        this.axes = {}
        this.axes.inner = args.axes || []
        this.axes.total = [...this.tensors.A.shape.keys()]
        this.axes.outer = Tensor.difference(this.axes.total, this.axes.inner)

        this.axes.A = this.axes.total
        this.axes.R = this.axes.outer

        /** Result */
        this.tensors.R = args.result || this.resultant()

        /** Dimensions */
        this.dimensions = {}
        this.dimensions.inner = this.axes.inner.reduce(function (size, axis) { return size * this.tensors.A.shape[axis] }.bind(this), 1)
        this.dimensions.outer = this.axes.inner.reduce(function (size, axis) { return size * this.tensors.A.shape[axis] }.bind(this), 1)

        /** Loops */
        this.loops = {}
        this.loops.total = Template.loopAxes(this.axes.total, this.tensors.A)
        this.loops.outer = Template.loopAxes(this.axes.outer, this.tensors.A)
        this.loops.inner = Template.loopAxes(this.axes.inner, this.tensors.A)

        /** Strides */
        this.strides = {}
        this.strides.A = this.tensors.A.strides
        this.strides.R = this.tensors.R.strides
        this.indices = {}

        /** Scalars */
        this.scalars = {}
        this.scalars.A = this.axes.total.map(Template.prefix)
        this.scalars.R = (this.axes.outer.length ? this.axes.outer : this.axes.total).map(Template.prefix)

        /** Indices */
        this.indices = {}
        this.indices.A = Template.index('AIndex', this.scalars.A, this.strides.A, this.tensors.A.offset)
        this.indices.R = Template.index('RIndex', this.scalars.R, this.strides.R, this.tensors.R.offset)

        /** Variables */
        this.variables = {}
        this.variables.T = Algebra.variable({ symbol: 'temp', index: '0', size: this.tensors.R.type.size })
        this.variables.A = Algebra.variable({ symbol: 'this.tensors.A.data', index: 'AIndex', size: this.tensors.A.type.size })
        this.variables.R = Algebra.variable({ symbol: 'this.tensors.R.data', index: 'RIndex', size: this.tensors.R.type.size })
    }

    resultant() {
        return Tensor.zeros({
            type: this.tensors.A.type,
            shape: this.tensors.A.shape.filter(function (_, axis) {
                return !this.axes.inner.includes(axis)
            }, this)
        })
    }
}
