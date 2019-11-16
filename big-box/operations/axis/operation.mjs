import Tensor from '../../tensor'
import Algebra from '../../template/algebra'
import Source from '../../template/source'

export default class AxisOperation {
    constructor(args) {
        /** Inputs */
        this.of = Tensor.tensor({ data:args.of})

        /** Axes */
        this.axes = {}
        this.axes.inner = args.axes || []
        this.axes.total = [...this.of.shape.keys()]
        this.axes.outer = Tensor.difference(this.axes.total, this.axes.inner)

        this.axes.of = this.axes.total
        this.axes.result = this.axes.outer

        /** Result */
        this.result = args.result || this.resultant()

        /** Dimensions */
        this.dimensions = {}
        this.dimensions.inner = this.axes.inner.reduce(function (size, axis) { return size * this.of.shape[axis] }.bind(this), 1)
        this.dimensions.outer = this.axes.inner.reduce(function (size, axis) { return size * this.of.shape[axis] }.bind(this), 1)

        /** Loops */
        this.loops = {}
        this.loops.total = Source.loopAxes(this.axes.total, this.of)
        this.loops.outer = Source.loopAxes(this.axes.outer, this.of)
        this.loops.inner = Source.loopAxes(this.axes.inner, this.of)

        /** Strides */
        this.strides = {}
        this.strides.of = this.of.strides
        this.strides.result = this.result.strides

        /** Scalars */
        this.scalars = {}
        this.scalars.of = this.axes.total.map(Source.prefix)
        this.scalars.R = (this.axes.outer.length ? this.axes.outer : this.axes.total).map(Source.prefix)

        /** Indices */
        this.indices = {}
        this.indices.of = Source.index('AIndex', this.scalars.of, this.strides.of, this.of.offset)
        this.indices.result = Source.index('RIndex', this.scalars.R, this.strides.result, this.result.offset)

        /** Variables */
        this.variables = {}
        this.variables.temp = Algebra.variable({ symbol: 'temp', index: '0', size: this.result.type.size })
        this.variables.of = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: this.of.type.size })
        this.variables.result = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: this.result.type.size })
    }

    resultant() {
        return Tensor.zeros({
            type: this.of.type,
            shape: this.of.shape.filter(function (_, axis) {
                return !this.axes.inner.includes(axis)
            }, this)
        })
    }
}
