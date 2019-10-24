import Algebra from '../../algebra'
import Operation from '../operation'
import Determinant from './determinant'

export default class Adjugate extends Operation {
    constructor(A, B, R) {
        super()

        this.A = A
        this.B = B
        this.R = R

        this.pointwise.adjugate = []
        this.pointwise.size = this.A.shape[0]
    }
    static resultant(A) { return { shape: A.shape, type: A.type } }

    pointwise() {
        for (let r = 0; r < this.pointwise.size; r++) {
            for (let c = 0; c < this.pointwise.size; c++) {
                const sign = Math.pow(-1, (r + c) % 2)
                const minor = Determinant.minor(Determinant.template(this.pointwise.size), c, r)
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
