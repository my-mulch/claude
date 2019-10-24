import Algebra from '../../algebra'
import Operation from '../operation'

export default class MatrixMultiplication extends Operation {
    constructor(A, B, R) {
        super()

        this.A = A
        this.B = B
        this.R = R

        /** Symbolic Matrix Multiplication */
        this.symbolic.indices.A = `const AI = r * A.strides[0] + s * A.strides[1] + A.offset`
        this.symbolic.indices.B = `const BI = r * B.strides[0] + s * B.strides[1] + B.offset`
        this.symbolic.indices.R = `const RI = r * R.strides[0] + c * R.strides[1] + R.offset`

        this.symbolic.variables.A = Algebra.variable({ symbol: 'A.data', size: A.type.size, index: 'AIndex' })
        this.symbolic.variables.B = Algebra.variable({ symbol: 'B.data', size: B.type.size, index: 'BIndex' })
        this.symbolic.variables.R = Algebra.variable({ symbol: 'R.data', size: R.type.size, index: 'RIndex' })

        this.symbolic.source = this.symbolic()
        this.symbolic.method = new Function('A,B,R', `${this.symbolic.source}; return R`)

        /** Pointwise Matrix Multiplication */
        this.pointwise.operations = []

        this.pointwise.rows = A.shape[0]
        this.pointwise.cols = B.shape[1]
        this.pointwise.like = A.shape[1]

        this.pointwise.variables.A = null
        this.pointwise.variables.B = null
        this.pointwise.variables.R = null
        this.pointwise.variables.innerProduct = null

        this.pointwise.source = this.pointwise()
        this.pointwise.method = new Function('A,B,R', `${this.pointwise.source}; return R`)
    }

    static resultant(A, B) { return { shape: [A.shape[0], B.shape[1]], type: A.type } }

    symbolic() {
        return [
            `for (let r = 0; r < A.shape[0]; r++){`,
            `for (let c = 0; c < B.shape[1]; c++){`,

            `R.data[RIndex] = 0`,
            this.symbolic.indices.R,

            `for (let s = 0; s < A.shape[1]; s++) {`,

            this.symbolic.indices.A,
            this.symbolic.indices.B,

            `${[
                Algebra.assign(
                    this.symbolic.variables.R,
                    Algebra.multiply(this.symbolic.variables.A, this.symbolic.variables.B), '+='
                )
            ]}`,

            `}}}`,
        ].join('\n')
    }

    pointwise() {
        for (let r = 0; r < this.pointwise.rows; r++) {
            for (let c = 0; c < this.pointwise.cols; c++) {

                this.pointwise.variables.R = Algebra.variable({
                    symbol: 'R.data',
                    size: R.type.size,
                    index: R.header.flatIndex([r, c])
                })

                this.pointwise.innerProduct = new Array(this.pointwise.like).fill(null).map(function (_, s) {

                    this.pointwise.variables.A = Algebra.variable({
                        symbol: 'A.data',
                        size: A.type.size,
                        index: A.header.flatIndex([r, s])
                    })

                    this.pointwise.variables.B = Algebra.variable({
                        symbol: 'B.data',
                        size: B.type.size,
                        index: B.header.flatIndex([s, c])
                    })

                    return Algebra.multiply(this.pointwise.variables.A, this.pointwise.variables.B)

                }).reduce(Algebra.add)

                this.pointwise.operations.push(Algebra.assign(
                    this.pointwise.variables.R,
                    this.pointwise.variables.innerProduct))
            }
        }

        return this.pointwise.operations.flat(Number.POSITIVE_INFINITY).join('\n')
    }
}
