import Tensor from '../../tensor'
import Algebra from '../../template/algebra'
import LinearAlgebraOperation from '../operation'

export default class CrossProduct extends LinearAlgebraOperation {
    constructor(args) {
        super(args, {
            route: function () { return this.pointwise() },
            resultant: function () { return Tensor.zeros({ shape: [3, 1], type: this.of.type }) },
            pointwise: function () {
                const A = [], B = [], R = []

                for (let i = 0; i < 3; i++) {
                    A.push(Algebra.variable({ symbol: 'A.data', index: this.of.header.flatIndex([i, 0]), size: this.of.type.size }))
                    B.push(Algebra.variable({ symbol: 'B.data', index: this.with.header.flatIndex([i, 0]), size: this.with.type.size }))
                    R.push(Algebra.variable({ symbol: 'R.data', index: this.result.header.flatIndex([i, 0]), size: this.result.type.size }))
                }

                return [
                    Algebra.assign(R[0], Algebra.add(Algebra.negate(Algebra.multiply(A[2], B[1])), Algebra.multiply(B[2], A[1]))),
                    Algebra.assign(R[1], Algebra.add(Algebra.negate(Algebra.multiply(A[0], B[2])), Algebra.multiply(B[0], A[2]))),
                    Algebra.assign(R[2], Algebra.subtract(Algebra.multiply(A[0], B[1]), Algebra.multiply(B[0], A[1]))),
                ]
            }
        })
    }
}
