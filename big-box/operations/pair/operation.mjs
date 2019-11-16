import Tensor from '../../tensor'
import Header from '../../header'
import Source from '../../template/source'
import Algebra from '../../template/algebra'

import { __Math__ } from '../../resources'

export default class PairOperation {
    constructor(args) {
        /** Tensors */
        this.of = Tensor.tensor({ data: args.of })
        this.with = Tensor.tensor({ data: args.with })
        this.result = args.result || this.resultant()

        /** Axes */
        this.axes = {}
        this.axes.total = [...new Array(__Math__.max(this.of.shape.length, this.with.shape.length)).keys()]

        this.axes.of = this.axes.total.slice().reverse().filter(Header.nonZeroAxes, this.of).reverse()
        this.axes.with = this.axes.total.slice().reverse().filter(Header.nonZeroAxes, this.with).reverse()
        this.axes.result = this.axes.total

        /** Loops */
        this.loops = {}
        this.loops.total = Source.loopAxes(this.axes.total, this.result)

        /** Strides */
        this.strides = {}
        this.strides.of = this.of.strides
        this.strides.with = this.with.strides
        this.strides.result = this.result.strides

        /** Scalars */
        this.scalars = {}
        this.scalars.of = this.axes.total.map(function (axis) { return this.axes.of.includes(axis) ? Source.prefix(axis) : 0 }, this)
        this.scalars.with = this.axes.total.map(function (axis) { return this.axes.with.includes(axis) ? Source.prefix(axis) : 0 }, this)
        this.scalars.result = this.axes.total.map(function (axis) { return this.axes.result.includes(axis) ? Source.prefix(axis) : 0 }, this)

        /** Indices */
        this.indices = {}
        this.indices.of = Source.index('AIndex', this.scalars.of, this.strides.of, this.of.offset)
        this.indices.with = Source.index('BIndex', this.scalars.with, this.strides.with, this.with.offset)
        this.indices.result = Source.index('RIndex', this.scalars.result, this.strides.result, this.result.offset)

        /** Variables */
        this.variables = {}
        this.variables.of = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: this.of.type.size })
        this.variables.with = Algebra.variable({ symbol: 'B.data', index: 'BIndex', size: this.with.type.size })
        this.variables.result = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: this.result.type.size })
    }

    resultant() {
        const maxLen = __Math__.max(
            this.of.shape.length,
            this.with.shape.length)

        const shape = []

        for (let i = 0; i < maxLen; i++) {
            const bi = this.with.shape.length - 1 - i
            const ai = this.of.shape.length - 1 - i

            if (this.with.shape[bi] === 1 || this.with.shape[bi] === undefined)
                shape.push(this.of.shape[ai])

            else if (this.of.shape[ai] === 1 || this.of.shape[ai] === undefined)
                shape.push(this.with.shape[bi])

            else if (this.with.shape[bi] === this.of.shape[ai])
                shape.push(this.of.shape[ai])
        }

        return Tensor.zeros({ shape: shape.reverse(), type: this.of.type })
    }
}
