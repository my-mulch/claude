import Algebra from '../../algebra'

export default {
    test: function (A, B, R, meta) {
        if (R.size > 1e3)
            return this.symbolic(A, B, R, meta)
        else
            return this.pointwise(A, B, R, meta)
    },
    symbolic: function (A, B, R, meta) {
        const sA = Algebra.variable({ symbol: 'A.data', size: A.type.size, index: 'AIndex' })
        const sB = Algebra.variable({ symbol: 'B.data', size: B.type.size, index: 'BIndex' })
        const sR = Algebra.variable({ symbol: 'R.data', size: R.type.size, index: 'RIndex' })

        return new Function('A, B, R, meta', [
            `for (let r = 0; r < A.shape[0]; r++){`,
            `for (let c = 0; c < B.shape[1]; c++){`,

            `const RIndex = r * R.strides[0] + c * R.strides[1] + R.offset`,
            `R.data[RIndex] = 0`,

            `for (let s = 0; s < A.shape[1]; s++) {`,

            `const AIndex = r * A.strides[0] + s * A.strides[1] + A.offset`,
            `const BIndex = r * B.strides[0] + s * B.strides[1] + B.offset`,

            `${Algebra.assign(sR, Algebra.multiply(sA, sB), '+=')}`,

            `}}}`,

            `return R`

        ].join('\n'))
    },
    pointwise: function (A, B, R, meta) {
        const operations = [], rows = A.shape[0], cols = B.shape[1], shared = A.shape[1]

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const sR = Algebra.variable({ symbol: 'R.data', size: R.type.size, index: R.header.flatIndex([r, c]) })

                const innerProduct = new Array(shared).fill(null).map(function (_, s) {
                    const sA = Algebra.variable({ symbol: 'A.data', size: A.type.size, index: A.header.flatIndex([r, s]) })
                    const sB = Algebra.variable({ symbol: 'B.data', size: B.type.size, index: B.header.flatIndex([s, c]) })

                    return Algebra.multiply(sA, sB)
                }).reduce(Algebra.add)

                operations.push(Algebra.assign(sR, innerProduct))
            }
        }

        return new Function('A, B, R', [
            operations.flat(Number.POSITIVE_INFINITY).join('\n'), `return R`
        ].join('\n'))
    }
}
