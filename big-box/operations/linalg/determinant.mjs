import Algebra from '../../algebra'

import { indexTemplate } from './utils'

export default class Determinant  {
    constructor(A, B, R) {
        

        this.A = A
        this.B = B
        this.R = R

        this.rows = this.A.shape[0]
        this.cols = this.A.shape[1]
        this.size = this.rows

        this.matrixTemplate = indexTemplate(this.size)

        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource(this.matrixTemplate)
        this.pointwise.method = new Function('A,B,R', `${this.pointwise.source}; return R`)
        
        this.invoke = this.pointwise.method
    }

    static fromAdjugate(adjugate) {
        return Algebra.assign(
            Algebra.variable({
                symbol: 'determinant',
                size: adjugate.A.type.size,
                index: 0
            }),
            new Array(adjugate.size).fill(null).map(function (_, i) {
                return Algebra.multiply(
                    Algebra.variable({
                        symbol: 'A.data',
                        size: adjugate.A.type.size,
                        index: adjugate.A.header.flatIndex([0, i])
                    }),
                    Algebra.variable({
                        symbol: 'R.data',
                        size: adjugate.A.type.size,
                        index: adjugate.R.header.flatIndex([i, 0])
                    }))
            }).reduce(Algebra.add))
    }

    static resultant(A) { return { shape: [1, 1], type: A.type.size } }

    pointwiseSource(matrix) {
        if (matrix.length === 1)
            return Algebra.variable({
                symbol: 'A.data',
                size: this.A.type.size,
                index: this.A.header.flatIndex(matrix[0])
            })

        const subDeterminants = []
        const size = Math.sqrt(matrix.length)

        for (let i = 0; i < size; i++) {
            const minor = Determinant.minor(matrix, 0, i)
            const subDeterminant = this.pointwiseSource(minor)

            const factor = Algebra.variable({
                symbol: 'A.data',
                size: this.A.type.size,
                index: this.A.header.flatIndex(matrix[i])
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
