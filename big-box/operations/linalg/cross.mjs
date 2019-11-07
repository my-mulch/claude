
import Algebra from '../../algebra'

export default class CrossProduct {
    constructor(A, B, R) {
        this.A = A
        this.B = B
        this.R = R

        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource()
        this.pointwise.method = new Function('A,B,R', `${this.pointwise.source}; return R`)

        this.invoke = this.pointwise.method
    }

    static resultant(A) { return { shape: [3, 1], type: A.type } }

    pointwiseSource() {
        const A = []
        const B = []
        const R = []

        for (let i = 0; i < 3; i++) {
            A.push(
                Algebra.variable({
                    symbol: 'A.data',
                    index: this.A.header.flatIndex([i, 0]),
                    size: this.A.type.size
                }))

            B.push(
                Algebra.variable({
                    symbol: 'B.data',
                    index: this.B.header.flatIndex([i, 0]),
                    size: this.B.type.size
                }))

            R.push(
                Algebra.variable({
                    symbol: 'R.data',
                    index: this.R.header.flatIndex([i, 0]),
                    size: this.R.type.size
                }))
        }

        return [
            Algebra.assign(R[0],
                Algebra.add(
                    Algebra.negate(Algebra.multiply(A[2], B[1])),
                    Algebra.multiply(B[2], A[1]))),

            Algebra.assign(R[1],
                Algebra.add(
                    Algebra.negate(Algebra.multiply(A[0], B[2])),
                    Algebra.multiply(B[0], A[2]))),

            Algebra.assign(R[2],
                Algebra.subtract(
                    Algebra.multiply(A[0], B[1]),
                    Algebra.multiply(B[0], A[1]))),
        ]
    }
}
