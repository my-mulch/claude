import Algebra from '../../algebra'


export default class MatrixMultiplication {
    constructor(A, B, R) {
        this.A = A
        this.B = B
        this.R = R

        this.rows = this.A.shape[0]
        this.cols = this.B.shape[1]
        this.like = this.A.shape[1]

        /** Symbolic Matrix Multiplication */
        if (this.like > 50) {
            this.indices = {}
            this.indices.A = `const AIndex = r * A.strides[0] + s * A.strides[1] + A.offset`
            this.indices.B = `const BIndex = r * B.strides[0] + s * B.strides[1] + B.offset`
            this.indices.R = `const RIndex = r * R.strides[0] + c * R.strides[1] + R.offset`

            this.variables = {}
            this.variables.A = Algebra.variable({ symbol: 'A.data', size: A.type.size, index: 'AIndex' })
            this.variables.B = Algebra.variable({ symbol: 'B.data', size: B.type.size, index: 'BIndex' })
            this.variables.R = Algebra.variable({ symbol: 'R.data', size: R.type.size, index: 'RIndex' })

            this.source = this.symbolicSource()
            this.method = new Function('A,B,R', `${this.source}; return R`)
            
            this.invoke = this.method

            return
        }

        /** Pointwise Matrix Multiplication */
        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource()
        this.pointwise.method = new Function('A,B,R', `${this.pointwise.source}; return R`)

        this.invoke = this.pointwise.method
    }

    static resultant(A, B) { return { shape: [A.shape[0], B.shape[1]], type: A.type } }


    symbolicSource() {
        return [
            `for (let r = 0; r < A.shape[0]; r++){`,
            `for (let c = 0; c < B.shape[1]; c++){`,

            this.indices.R,
            `R.data[RIndex] = 0`,

            `for (let s = 0; s < A.shape[1]; s++) {`,

            this.indices.A,
            this.indices.B,

            `${[
                Algebra.assign(
                    this.variables.R,
                    Algebra.multiply(this.variables.A, this.variables.B), '+='
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
