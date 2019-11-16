import Tensor from '../../tensor'
import Algebra from '../../template/algebra'

export default class MatrixMultiplication {
    constructor(args) {
        this.tensors = {}
        this.of = Tensor.tensor({ data: args.of })
        this.with = Tensor.tensor({ data: args.with })
        this.result = args.result || this.resultant()

        this.rows = this.of.shape[0]
        this.cols = this.with.shape[1]
        this.like = this.of.shape[1]

        /** Symbolic Matrix Multiplication */
        if (this.like > 50) {
            this.indices = {}
            this.indices.of = `const AIndex = r * A.strides[0] + s * A.strides[1] + A.offset`
            this.indices.with = `const BIndex = r * B.strides[0] + s * B.strides[1] + B.offset`
            this.indices.result = `const RIndex = r * R.strides[0] + c * R.strides[1] + R.offset`

            this.variables = {}
            this.variables.of = Algebra.variable({ symbol: 'A.data', size: this.of.type.size, index: 'AIndex' })
            this.variables.with = Algebra.variable({ symbol: 'B.data', size: this.with.type.size, index: 'BIndex' })
            this.variables.result = Algebra.variable({ symbol: 'R.data', size: this.result.type.size, index: 'RIndex' })

            this.symbolic = {}
            this.symbolic.source = this.symbolicSource()

            this.invoke = new Function('A,B,R', `${this.symbolic.source}; return R`)

            if (!args.template)
                this.invoke = this.invoke.bind(null, this.of, this.with, this.result)

            return
        }

        /** Pointwise Matrix Multiplication */
        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource()

        this.invoke = new Function('A,B,R', `${this.pointwise.source}; return R`).bind(this)

        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }

    resultant() {
        return Tensor.zeros({
            type: this.of.type,
            shape: [
                this.of.shape[0],
                this.with.shape[1]
            ]
        })
    }


    symbolicSource() {
        return [
            `for (let r = 0; r < A.shape[0]; r++){`,
            `for (let c = 0; c < B.shape[1]; c++){`,

            this.indices.result,
            `R.data[RIndex] = 0`,

            `for (let s = 0; s < A.shape[1]; s++) {`,

            this.indices.of,
            this.indices.with,

            Algebra.assign(
                this.variables.result,
                Algebra.multiply(this.variables.of, this.variables.with), '+='
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
                        symbol: 'R.data',
                        size: this.result.type.size,
                        index: this.result.header.flatIndex([r, c])
                    }), new Array(this.like).fill(null).map(function (_, s) {
                        return Algebra.multiply(
                            Algebra.variable({
                                symbol: 'A.data',
                                size: this.of.type.size,
                                index: this.of.header.flatIndex([r, s])
                            }),
                            Algebra.variable({
                                symbol: 'B.data',
                                size: this.with.type.size,
                                index: this.with.header.flatIndex([s, c])
                            }))
                    }, this).reduce(Algebra.add)
                ))
            }
        }

        return operations.flat(Number.POSITIVE_INFINITY).join('\n')
    }
}
