import Tensor from '../../tensor'
import Algebra from '../../algebra'
import Adjugate from './adjugate'
import Determinant from './determinant'

export default class Inverse {
    constructor(args) {
        this.tensors = {}
        this.tensors.A = Tensor.tensor({ data: args.of })
        this.tensors.R = args.result || this.resultant()

        this.rows = this.tensors.A.shape[0]
        this.cols = this.tensors.A.shape[1]
        this.size = this.rows

        /** Pointwise Inverse */
        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource()

        this.invoke = new Function(`
            const temp = new Array(${this.tensors.A.type.size})
            const determinant = new Array(${this.tensors.A.type.size})
            ${this.pointwise.source.join('\n')};
            return this.tensors.R`
        ).bind(this)
    }

    resultant() {
        return Tensor.zeros({
            shape: this.tensors.A.shape,
            type: this.tensors.A.type
        })
    }

    pointwiseSource() {
        this.adjugate = new Adjugate({ of: this.tensors.A, result: this.tensors.R })
        this.determinant = Determinant.fromAdjugate(this.adjugate)

        const operations = []
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const D = Algebra.variable({
                    symbol: 'determinant',
                    size: this.tensors.A.type.size,
                    index: 0
                })

                const R = Algebra.variable({
                    index: this.tensors.R.header.flatIndex([r, c]),
                    symbol: 'this.tensors.R.data',
                    size: this.tensors.R.type.size,
                })

                const T = Algebra.variable({
                    symbol: 'temp',
                    size: this.tensors.A.type.size,
                    index: 0
                })

                operations.push(Algebra.divide(T, R, D))
                operations.push(Algebra.assign(R, T))
            }
        }

        return [
            this.adjugate.pointwise.source,
            this.determinant,
            operations
        ].flat(Number.POSITIVE_INFINITY)
    }
}
