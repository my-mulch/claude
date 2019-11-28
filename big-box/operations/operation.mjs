import Types from '../types'
import Tensor from '../tensor'
import Source from '../template/source'
import Algebra from '../template/algebra'

export default class TensorOperation {
    constructor(args) {
        /** Sanitize */
        this.of = Tensor.tensor({ data: args.of })
        this.with = Tensor.tensor({ data: args.with })

        /** Promote */
        this.type = Types.promote(this.of, this.with)
        this.of = this.of.astype({ type: this.type })
        this.with = this.with.astype({ type: this.type })
    }

    shape(axis) {
        return this.shape[axis]
    }

    size(size, axis) {
        return size * this.shape[axis]
    }

    symbolicSourceBoilerplate() {
        /** Indices */
        this.indices = {}
        this.indices.of = new Source([`const AIndex = ${this.of.header.symbolicIndex(this.axes.of)}`])
        this.indices.with = new Source([`const BIndex = ${this.with.header.symbolicIndex(this.axes.with)}`])
        this.indices.result = new Source([`const RIndex = ${this.result.header.symbolicIndex(this.axes.result)}`])

        /** Variables */
        this.variables = {}
        this.variables.of = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: this.of.type.size })
        this.variables.with = Algebra.variable({ symbol: 'B.data', index: 'BIndex', size: this.with.type.size })
        this.variables.result = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: this.result.type.size })
        this.variables.temp = Algebra.variable({ symbol: 'temp', index: 0, size: this.result.type.size })
    }
}
