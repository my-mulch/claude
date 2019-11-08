import Tensor from '../../tensor'
import Header from '../../header'
import Algebra from '../../algebra'
import Template from '../../template'
import { __Math__ } from '../../resources'

export default class PairOperation {
    constructor(args) {
        /** Tensors */
        this.tensors = {}
        this.tensors.A = Tensor.tensor({ data: args.of })
        this.tensors.B = Tensor.tensor({ data: args.with })
        this.tensors.R = args.result || this.resultant()

        /** Axes */
        this.axes = {}
        this.axes.total = Tensor.keys(__Math__.max(
            this.tensors.A.shape.length,
            this.tensors.B.shape.length))

        this.axes.R = this.axes.total
        this.axes.A = this.axes.total.slice().reverse().filter(Header.nonZeroAxes, this.tensors.A).reverse()
        this.axes.B = this.axes.total.slice().reverse().filter(Header.nonZeroAxes, this.tensors.B).reverse()

        /** Loops */
        this.loops = {}
        this.loops.total = Template.loopAxes(this.axes.total, this.tensors.R)

        /** Strides */
        this.strides = {}
        this.strides.A = this.tensors.A.strides
        this.strides.B = this.tensors.B.strides
        this.strides.R = this.tensors.R.strides

        /** Scalars */
        this.scalars = {}
        this.scalars.A = this.axes.total.map(function (axis) { return this.axes.A.includes(axis) ? Template.prefix(axis) : 0 }, this)
        this.scalars.B = this.axes.total.map(function (axis) { return this.axes.B.includes(axis) ? Template.prefix(axis) : 0 }, this)
        this.scalars.R = this.axes.total.map(function (axis) { return this.axes.R.includes(axis) ? Template.prefix(axis) : 0 }, this)

        /** Indices */
        this.indices = {}
        this.indices.A = Template.index('AIndex', this.scalars.A, this.strides.A, this.tensors.A.offset)
        this.indices.B = Template.index('BIndex', this.scalars.B, this.strides.B, this.tensors.B.offset)
        this.indices.R = Template.index('RIndex', this.scalars.R, this.strides.R, this.tensors.R.offset)

        /** Variables */
        this.variables = {}
        this.variables.A = Algebra.variable({ symbol: 'this.tensors.A.data', index: 'AIndex', size: this.tensors.A.type.size })
        this.variables.B = Algebra.variable({ symbol: 'this.tensors.B.data', index: 'BIndex', size: this.tensors.B.type.size })
        this.variables.R = Algebra.variable({ symbol: 'this.tensors.R.data', index: 'RIndex', size: this.tensors.R.type.size })
    }

    resultant() {
        const maxLen = __Math__.max(
            this.tensors.A.shape.length,
            this.tensors.B.shape.length)

        const shape = []

        for (let i = 0; i < maxLen; i++) {
            const bi = this.tensors.B.shape.length - 1 - i
            const ai = this.tensors.A.shape.length - 1 - i

            if (this.tensors.B.shape[bi] === 1 || this.tensors.B.shape[bi] === undefined)
                shape.push(this.tensors.A.shape[ai])

            else if (this.tensors.A.shape[ai] === 1 || this.tensors.A.shape[ai] === undefined)
                shape.push(this.tensors.B.shape[bi])

            else if (this.tensors.B.shape[bi] === this.tensors.A.shape[ai])
                shape.push(this.tensors.A.shape[ai])
        }

        return Tensor.zeros({ shape: shape.reverse(), type: this.tensors.A.type })
    }
}
