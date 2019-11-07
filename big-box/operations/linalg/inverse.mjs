import Algebra from '../../algebra'


import Adjugate from './adjugate'
import Determinant from './determinant'

export default class Inverse {
    constructor(A, B, R) {


        this.A = A
        this.B = B
        this.R = R

        this.rows = this.A.shape[0]
        this.cols = this.A.shape[1]
        this.size = this.rows

        /** Pointwise Inverse */
        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource()
        this.pointwise.method = new Function('A,B,R', `
            const temp = new Array(${this.A.type.size})
            const determinant = new Array(${this.A.type.size})
            ${this.pointwise.source.join('\n')};
            return R
        `)

        this.invoke = this.pointwise.method
    }

    static resultant(A) { return { shape: A.shape, type: A.type } }

    pointwiseSource() {
        this.adjugate = new Adjugate(this.A, this.B, this.R)
        this.determinant = Determinant.fromAdjugate(this.adjugate)

        const operations = []
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const D = Algebra.variable({
                    symbol: 'determinant',
                    size: this.A.type.size,
                    index: 0
                })

                const R = Algebra.variable({
                    index: this.R.header.flatIndex([r, c]),
                    symbol: 'R.data',
                    size: this.R.type.size,
                })

                const T = Algebra.variable({
                    symbol: 'temp',
                    size: this.A.type.size,
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
