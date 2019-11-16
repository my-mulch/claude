import Tensor from '../../tensor'
import Algebra from '../../template/algebra'
import { indexTemplate } from './utils'

export default class Determinant {
    constructor(args) {
        this.of = Tensor.tensor({ data: args.of})
        this.result = args.result || this.resultant()

        this.rows = this.of.shape[0]
        this.cols = this.of.shape[1]
        this.size = this.rows

        this.matrixTemplate = indexTemplate(this.size)

        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource(this.matrixTemplate)

        this.invoke = new Function('A,B,R', [this.pointwise.source, `return R`].join('\n'))

        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }

    static fromAdjugate(adjugate) {
        return Algebra.assign(
            Algebra.variable({
                symbol: 'determinant',
                size: adjugate.of.type.size,
                index: 0
            }),
            new Array(adjugate.size).fill(null).map(function (_, i) {
                return Algebra.multiply(
                    Algebra.variable({
                        symbol: 'A.data',
                        size: adjugate.of.type.size,
                        index: adjugate.of.header.flatIndex([0, i])
                    }),
                    Algebra.variable({
                        symbol: 'R.data',
                        size: adjugate.of.type.size,
                        index: adjugate.result.header.flatIndex([i, 0])
                    }))
            }).reduce(Algebra.add))
    }

    resultant() {
        return Tensor.zeros({
            shape: [1, 1],
            type: this.of.type.size
        })
    }

    pointwiseSource(matrix) {
        if (matrix.length === 1)
            return Algebra.variable({
                symbol: 'A.data',
                size: this.of.type.size,
                index: this.of.header.flatIndex(matrix[0])
            })

        const subDeterminants = []
        const size = Math.sqrt(matrix.length)

        for (let i = 0; i < size; i++) {
            const minor = Determinant.minor(matrix, 0, i)
            const subDeterminant = this.pointwiseSource(minor)

            const factor = Algebra.variable({
                symbol: 'A.data',
                size: this.of.type.size,
                index: this.of.header.flatIndex(matrix[i])
            })

            const cofactor = Algebra.multiply(factor, subDeterminant)

            subDeterminants.push(Math.pow(-1, i % 2) > 0 ? cofactor : Algebra.negate(cofactor))
        }

        return subDeterminants.reduce(Algebra.add)
    }

    static minor(matrix, r, c) {
        const size = Math.sqrt(matrix.length)

        return matrix.filter(function (_, index) {
            if (index % size === c) return false // in column
            if (Math.floor(index / size) === r) return false // in row

            return true
        })
    }
}
