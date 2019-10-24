import Algebra from '../../algebra'
import Operation from '../operation'

export default class MatMult extends Operation {
    create(A, B, R) {
        this.initialize(A, B, R)

        if (R.size > 1e3)
            return this.symbolic()
        else
            return this.pointwise(A, B, R, meta)
    }

    initialize(A, B, R) {
        this.RI = `const RI = r * R.strides[0] + c * R.strides[1] + R.offset`
        this.AI = `const AI = r * A.strides[0] + s * A.strides[1] + A.offset`
        this.BI = `const BI = r * B.strides[0] + s * B.strides[1] + B.offset`

        this.A = Algebra.variable({ symbol: 'A.data', size: A.type.size, index: 'AIndex' })
        this.B = Algebra.variable({ symbol: 'B.data', size: B.type.size, index: 'BIndex' })
        this.R = Algebra.variable({ symbol: 'R.data', size: R.type.size, index: 'RIndex' })
    }

    static resultant(A, B) {
        return {
            shape: [A.shape[0], B.shape[1]],
            type: A.type
        }
    }

    symbolic() {
        return new Function('A, B, R, meta', [
            `for (let r = 0; r < A.shape[0]; r++){`,
            `for (let c = 0; c < B.shape[1]; c++){`,
            this.RI, `R.data[RIndex] = 0`,
            `for (let s = 0; s < A.shape[1]; s++) {`,
            this.AI, this.BI,
            `${Algebra.assign(this.R, Algebra.multiply(this.A, this.B), '+=')}`,
            `}}}`,
            `return R`
        ].join('\n'))
    }

    pointwise(A, B, R, meta) {
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
            operations.flat(Number.POSITIVE_INFINITY).join('\n'),
            `return R`
        ].join('\n'))
    }
}
