import Tensor from '../../tensor'
import Algebra from '../../template/algebra'
import Adjugate from './adjugate'
import Determinant from './determinant'

export default class Inverse {
    constructor(args) {
        this.tensors = {}
        this.of = Tensor.tensor({ data:args.of})
        this.result = args.result || this.resultant()

        this.rows = this.of.shape[0]
        this.cols = this.of.shape[1]
        this.size = this.rows

        /** Pointwise Inverse */
        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource()

        this.invoke = new Function('A,B,R', `
            const temp = new Array(${this.of.type.size})
            const determinant = new Array(${this.of.type.size})
            ${this.pointwise.source.join('\n')};
            return R`
        )

        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }

    resultant() {
        return Tensor.zeros({
            shape: this.of.shape,
            type: this.of.type
        })
    }

    pointwiseSource() {
        this.adjugate = new Adjugate({ of: this.of, result: this.result })
        this.determinant = Determinant.fromAdjugate(this.adjugate)

        const operations = []
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const D = Algebra.variable({
                    symbol: 'determinant',
                    size: this.of.type.size,
                    index: 0
                })

                const R = Algebra.variable({
                    index: this.result.header.flatIndex([r, c]),
                    symbol: 'R.data',
                    size: this.result.type.size,
                })

                const T = Algebra.variable({
                    symbol: 'temp',
                    size: this.of.type.size,
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
