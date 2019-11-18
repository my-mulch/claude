import Tensor from '../../tensor'
import Algebra from '../../template/algebra'
import MatrixOperation from '../operation'

export default class MatrixMultiplication extends MatrixOperation {
    constructor(args) {
        super(args, {
            route: function () {
                if (this.like < 50) return this.pointwise()

                return this.symbolic()
            },
            resultant: function () {
                return Tensor.zeros({
                    type: this.of.type,
                    shape: [this.of.shape[0], this.with.shape[1]]
                })
            },
            pointwise: function () {
                this.source = []

                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        const A = Algebra.variable({ symbol: 'A.data', size: this.of.type.size, index: this.of.header.flatIndex([r, s]) })
                        const B = Algebra.variable({ symbol: 'B.data', size: this.with.type.size, index: this.with.header.flatIndex([s, c]) })
                        const R = Algebra.variable({ symbol: 'R.data', size: this.result.type.size, index: this.result.header.flatIndex([r, c]) })

                        const dot = new Array(this.like).fill(null).map(function (_, s) { return Algebra.multiply(A, B) }, this).reduce(Algebra.add)

                        this.source.push(Algebra.assign(R, dot))
                    }
                }

                return this.source.join('\n')
            },
            symbolic: function () {
                this.source = []

                this.variables.of = Algebra.variable({ symbol: 'A.data', size: this.of.type.size, index: 'AIndex' })
                this.variables.with = Algebra.variable({ symbol: 'B.data', size: this.with.type.size, index: 'BIndex' })
                this.variables.result = Algebra.variable({ symbol: 'R.data', size: this.result.type.size, index: 'RIndex' })

                this.source.push(
                    `for (let r = 0; r < A.shape[0]; r++){`,
                    `for (let c = 0; c < B.shape[1]; c++){`,

                    `const RIndex = r * R.strides[0] + c * R.strides[1] + R.offset`,
                    `R.data[RIndex] = 0`,

                    `for (let s = 0; s < A.shape[1]; s++) {`,

                    `const AIndex = r * A.strides[0] + s * A.strides[1] + A.offset`,
                    `const BIndex = r * B.strides[0] + s * B.strides[1] + B.offset`,

                    Algebra.assign(
                        this.variables.result,
                        Algebra.multiply(this.variables.of, this.variables.with), '+='
                    ),

                    `}}}`,
                )

                return this.source.join('\n')
            }
        })
    }
}
