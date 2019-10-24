import Algebra from '../../algebra'
import Operation from '../operation'

export default class Adjugate extends Operation {
    create(A, B, R) { return this.pointwise(A, B, R) }
    resultant(A, B, R, meta) { return { shape: A.shape, type: A.type } }
    pointwise(A, B, R) {
        const adjoint = []
        const matrixTemplate = Adjugate.template(A.shape)

        for (let r = 0; r < A.shape[0]; r++) {
            for (let c = 0; c < A.shape[0]; c++) {
                const sign = Math.pow(-1, (r + c) % 2)

                const cofactor = Adjugate.cofactors(Adjugate.delete(matrixTemplate, c, r), A)

                const sR = Algebra.variable({
                    index: R.header.flatIndex([r, c]),
                    symbol: 'R.data',
                    size: R.type.size
                })

                adjoint.push(Algebra.assign(sR, sign < 0 ? Algebra.negate(cofactor) : cofactor))
            }
        }

        return adjoint.join('\n')
    }

    static cofactors(matrix) {
        if (matrix.length === 1)
            return Algebra.variable({
                symbol: 'A.data',
                size: array.type.size,
                index: array.header.flatIndex(matrix[0])
            })

        const allCofactors = []
        const size = Math.sqrt(matrix.length)

        for (let i = 0; i < size; i++) {
            const sign = Math.pow(-1, i % 2)

            const cofactor = Adjugate.cofactors(Adjugate.delete(matrix, 0, i), array)

            const factor = Algebra.variable({
                symbol: 'A.data',
                size: array.type.size,
                index: array.header.flatIndex(matrix[i])
            })

            const product = Algebra.multiply(factor, cofactor)
            allCofactors.push(sign > 0 ? product : Algebra.negate(product))
        }

        return allCofactors.reduce(Algebra.add)
    }

}
