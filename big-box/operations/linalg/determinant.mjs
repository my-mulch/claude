import Tensor from '../../tensor'
import Algebra from '../../algebra'
import { indexTemplate } from './utils'

export default class Determinant {
    constructor(args) {
        this.tensors = {}
        this.tensors.A = Tensor.tensor({ data: args.of })
        this.tensors.R = args.result || this.resultant()

        this.rows = this.tensors.A.shape[0]
        this.cols = this.tensors.A.shape[1]
        this.size = this.rows

        this.matrixTemplate = indexTemplate(this.size)

        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource(this.matrixTemplate)

        this.invoke = new Function([this.pointwise.source, `return R`].join('\n'))
    }

    static fromAdjugate(adjugate) {
        return Algebra.assign(
            Algebra.variable({
                symbol: 'determinant',
                size: adjugate.tensors.A.type.size,
                index: 0
            }),
            new Array(adjugate.size).fill(null).map(function (_, i) {
                return Algebra.multiply(
                    Algebra.variable({
                        symbol: 'this.tensors.A.data',
                        size: adjugate.tensors.A.type.size,
                        index: adjugate.tensors.A.header.flatIndex([0, i])
                    }),
                    Algebra.variable({
                        symbol: 'this.tensors.R.data',
                        size: adjugate.tensors.A.type.size,
                        index: adjugate.tensors.R.header.flatIndex([i, 0])
                    }))
            }).reduce(Algebra.add))
    }

    resultant() {
        return Tensor.zeros({
            shape: [1, 1],
            type: this.tensors.A.type.size
        })
    }

    pointwiseSource(matrix) {
        if (matrix.length === 1)
            return Algebra.variable({
                symbol: 'this.tensors.A.data',
                size: this.tensors.A.type.size,
                index: this.tensors.A.header.flatIndex(matrix[0])
            })

        const subDeterminants = []
        const size = Math.sqrt(matrix.length)

        for (let i = 0; i < size; i++) {
            const minor = Determinant.minor(matrix, 0, i)
            const subDeterminant = this.pointwiseSource(minor)

            const factor = Algebra.variable({
                symbol: 'this.tensors.A.data',
                size: this.tensors.A.type.size,
                index: this.tensors.A.header.flatIndex(matrix[i])
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
