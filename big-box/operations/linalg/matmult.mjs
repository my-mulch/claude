import Tensor from '../../tensor'
import Algebra from '../../algebra'

export default class MatrixMultiplication {
    constructor(args) {
        this.tensors = {}
        this.tensors.A = Tensor.tensor({ data: args.of })
        this.tensors.B = Tensor.tensor({ data: args.with })
        this.tensors.R = args.result || this.resultant()

        this.rows = this.tensors.A.shape[0]
        this.cols = this.tensors.B.shape[1]
        this.like = this.tensors.A.shape[1]

        /** Symbolic Matrix Multiplication */
        if (this.like > 50) {
            this.indices = {}
            this.indices.A = `const AIndex = r * this.tensors.A.strides[0] + s * this.tensors.A.strides[1] + this.tensors.A.offset`
            this.indices.B = `const BIndex = r * this.tensors.B.strides[0] + s * this.tensors.B.strides[1] + this.tensors.B.offset`
            this.indices.R = `const RIndex = r * this.tensors.R.strides[0] + c * this.tensors.R.strides[1] + this.tensors.R.offset`

            this.variables = {}
            this.variables.A = Algebra.variable({ symbol: 'this.tensors.A.data', size: this.tensors.A.type.size, index: 'AIndex' })
            this.variables.B = Algebra.variable({ symbol: 'this.tensors.B.data', size: this.tensors.B.type.size, index: 'BIndex' })
            this.variables.R = Algebra.variable({ symbol: 'this.tensors.R.data', size: this.tensors.R.type.size, index: 'RIndex' })

            this.symbolic = {}
            this.symbolic.source = this.symbolicSource()

            this.invoke = new Function(`${this.symbolic.source}; return this.tensors.R`).bind(this)
            return
        }

        /** Pointwise Matrix Multiplication */
        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource()

        this.invoke = new Function(`${this.pointwise.source}; return this.tensors.R`).bind(this)
    }

    resultant() {
        return Tensor.zeros({
            type: this.tensors.A.type,
            shape: [
                this.tensors.A.shape[0],
                this.tensors.B.shape[1]
            ]
        })
    }


    symbolicSource() {
        return [
            `for (let r = 0; r < this.tensors.A.shape[0]; r++){`,
            `for (let c = 0; c < this.tensors.B.shape[1]; c++){`,

            this.indices.R,
            `this.tensors.R.data[RIndex] = 0`,

            `for (let s = 0; s < this.tensors.A.shape[1]; s++) {`,

            this.indices.A,
            this.indices.B,

            Algebra.assign(
                this.variables.R,
                Algebra.multiply(this.variables.A, this.variables.B), '+='
            ),

            `}}}`,
        ].join('\n')
    }

    pointwiseSource() {
        const operations = []

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                operations.push(Algebra.assign(
                    Algebra.variable({
                        symbol: 'this.tensors.R.data',
                        size: this.tensors.R.type.size,
                        index: this.tensors.R.header.flatIndex([r, c])
                    }), new Array(this.like).fill(null).map(function (_, s) {
                        return Algebra.multiply(
                            Algebra.variable({
                                symbol: 'this.tensors.A.data',
                                size: this.tensors.A.type.size,
                                index: this.tensors.A.header.flatIndex([r, s])
                            }),
                            Algebra.variable({
                                symbol: 'this.tensors.B.data',
                                size: this.tensors.B.type.size,
                                index: this.tensors.B.header.flatIndex([s, c])
                            }))
                    }, this).reduce(Algebra.add)
                ))
            }
        }

        return operations.flat(Number.POSITIVE_INFINITY).join('\n')
    }
}
