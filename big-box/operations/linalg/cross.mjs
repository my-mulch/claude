import Tensor from '../../tensor'
import Algebra from '../../algebra'

export default class CrossProduct {
    constructor(args) {
        this.tensors = {}
        this.tensors.A = Tensor.tensor({ data: args.of })
        this.tensors.B = Tensor.tensor({ data: args.with })
        this.tensors.R = args.result || this.resultant()

        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource()

        this.invoke = new Function(this.pointwise.source.join('\n')).bind(this)
    }

    resultant() { return Tensor.zeros({ shape: [3, 1], type: this.tensors.A.type }) }

    pointwiseSource() {
        const A = [], B = [], R = []

        for (let i = 0; i < 3; i++) {
            A.push(Algebra.variable({
                symbol: 'this.tensors.A.data',
                index: this.tensors.A.header.flatIndex([i, 0]),
                size: this.tensors.A.type.size
            }))

            B.push(Algebra.variable({
                symbol: 'this.tensors.B.data',
                index: this.tensors.B.header.flatIndex([i, 0]),
                size: this.tensors.B.type.size
            }))

            R.push(Algebra.variable({
                symbol: 'this.tensors.R.data',
                index: this.tensors.R.header.flatIndex([i, 0]),
                size: this.tensors.R.type.size
            }))
        }

        return [
            Algebra.assign(R[0], Algebra.add(Algebra.negate(Algebra.multiply(A[2], B[1])), Algebra.multiply(B[2], A[1]))),
            Algebra.assign(R[1], Algebra.add(Algebra.negate(Algebra.multiply(A[0], B[2])), Algebra.multiply(B[0], A[2]))),
            Algebra.assign(R[2], Algebra.subtract(Algebra.multiply(A[0], B[1]), Algebra.multiply(B[0], A[1]))),

            `return this.tensors.R`
        ]
    }
}
