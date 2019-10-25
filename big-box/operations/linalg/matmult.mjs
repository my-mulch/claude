import Algebra from '../algebra'
import Operation from '../operation'

export default class MatrixMultiplication extends Operation {
    constructor(A, B, R) {
        super()

        this.A = A
        this.B = B
        this.R = R

        this.rows = this.A.shape[0]
        this.cols = this.B.shape[1]
        this.like = this.A.shape[1]

        /** Symbolic Matrix Multiplication */
        this.symbolic = {}

        this.symbolic.indices = {}
        this.symbolic.indices.A = `const AI = r * A.strides[0] + s * A.strides[1] + A.offset`
        this.symbolic.indices.B = `const BI = r * B.strides[0] + s * B.strides[1] + B.offset`
        this.symbolic.indices.R = `const RI = r * R.strides[0] + c * R.strides[1] + R.offset`

        this.symbolic.variables = {}
        this.symbolic.variables.A = Algebra.variable({ symbol: 'A.data', size: A.type.size, index: 'AIndex' })
        this.symbolic.variables.B = Algebra.variable({ symbol: 'B.data', size: B.type.size, index: 'BIndex' })
        this.symbolic.variables.R = Algebra.variable({ symbol: 'R.data', size: R.type.size, index: 'RIndex' })

        this.symbolic.source = this.symbolicSource()
        this.symbolic.method = new Function('A,B,R', `${this.symbolic.source}; return R`)

        /** Pointwise Matrix Multiplication */
        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource()
        this.pointwise.method = new Function('A,B,R', `${this.pointwise.source}; return R`)

        /** Routing dependent on template size */

        if (this.like < 1e2)
            this.invoke = this.pointwise.method
        else
            this.invoke = this.symbolic.method
    }

    static resultant(A, B) { return { shape: [A.shape[0], B.shape[1]], type: A.type } }


    symbolicSource() {
        return [
            `for (let r = 0; r < A.shape[0]; r++){`,
            `for (let c = 0; c < B.shape[1]; c++){`,

            this.symbolic.indices.R,
            `R.data[RI] = 0`,

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

    pointwiseSource() {
        const operations = []

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                operations.push(Algebra.assign(
                    Algebra.variable({
                        symbol: 'R.data',
                        size: this.R.type.size,
                        index: this.R.header.flatIndex([r, c])
                    }), new Array(this.like).fill(null).map(function (_, s) {
                        return Algebra.multiply(
                            Algebra.variable({
                                symbol: 'A.data',
                                size: this.A.type.size,
                                index: this.A.header.flatIndex([r, s])
                            }),
                            Algebra.variable({
                                symbol: 'B.data',
                                size: this.B.type.size,
                                index: this.B.header.flatIndex([s, c])
                            }))
                    }, this).reduce(Algebra.add)
                ))
            }
        }

        return operations.flat(Number.POSITIVE_INFINITY).join('\n')
    }
}
