import Algebra from '../algebra'

import Determinant from './determinant'

import { indexTemplate } from './utils.mjs'

export default class Adjugate  {
    constructor(A, B, R) {
        

        this.A = A
        this.B = B
        this.R = R
        this.size = this.A.shape[0]

        this.determinant = new Determinant(A, B, R)

        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource()
        this.pointwise.method = new Function('A,B,R', `${this.pointwise.source}; return R`)

        this.invoke = this.pointwise.method
    }

    static resultant(A) { return { shape: A.shape, type: A.type } }

    pointwiseSource() {
        const adjugate = []

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const sign = Math.pow(-1, (r + c) % 2)
                const minor = Determinant.minor(indexTemplate(this.size), c, r)
                const determinant = this.determinant.pointwiseSource(minor)
                const cofactor = sign < 0 ? Algebra.negate(determinant) : determinant

                adjugate.push(Algebra.assign(Algebra.variable({
                    index: this.R.header.flatIndex([r, c]),
                    symbol: 'R.data',
                    size: this.R.type.size
                }), cofactor))
            }
        }

        return adjugate
    }
}
