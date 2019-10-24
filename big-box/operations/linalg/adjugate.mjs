import Algebra from '../../algebra'
import Operation from '../operation'
import Determinant from './determinant'

export default class Adjugate extends Operation {
    create(A, B, R) { return this.pointwise(A, B, R) }
    resultant(A, B, R, meta) { return { shape: A.shape, type: A.type } }
    pointwise(A, B, R) {
        const adjugate = []

        for (let r = 0; r < A.shape[0]; r++) {
            for (let c = 0; c < A.shape[0]; c++) {
                const sign = Math.pow(-1, (r + c) % 2)
                const minor = Determinant.minor(Determinant.template(A.shape[0]), c, r)
                const determinant = Determinant.pointwise(A, B, R, minor)
                const cofactor = sign < 0 ? Algebra.negate(determinant) : determinant

                adjugate.push(Algebra.assign(Algebra.variable({
                    index: R.header.flatIndex([r, c]),
                    symbol: 'R.data',
                    size: R.type.size
                }), cofactor))
            }
        }

        return adjugate.join('\n')
    }
}
