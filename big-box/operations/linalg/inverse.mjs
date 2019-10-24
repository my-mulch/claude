import Algebra from '../../algebra'
import Adjugate from './adjugate'
import Operation from '../operation'

export default class Inverse extends Operation {
    create(A, B, R, meta) { return this.pointwise(A, B, R, meta) }
    resultant(A, B, R, meta) { return { shape: A.shape, type: A.type } }
    pointwise(A, B, R, meta) {
        const temp = Algebra.variable({ symbol: 'temp', size: A.type.size, index: 0 })

        const source = [
            `const temp = new Array(${A.type.size})`,
            `const determinant = new Array(${A.type.size})`,
        ]

        const adjugate = Adjugate.pointwise(A, B, R, meta)

        const determinantVariable = Algebra.variable({ symbol: 'determinant', size: A.type.size, index: 0 })
        const determinantSymbolic = new Array(A.shape[0]).fill(null).map(function (_, i) {
            const factors = Algebra.variable({ symbol: 'A.data', size: A.type.size, index: A.header.flatIndex([0, i]) })
            const cofactors = Algebra.variable({ symbol: 'R.data', size: A.type.size, index: R.header.flatIndex([i, 0]) })

            return Algebra.multiply(factors, cofactors)
        }).reduce(Algebra.add)

        const determinant = Algebra.assign(determinantVariable, determinantSymbolic)

        const inverse = new Array(size * size).fill(null).map(function (_, i) {
            const c = i % size
            const r = Math.floor(i / size)
            const sR = Algebra.variable({ index: R.header.flatIndex([r, c]), symbol: 'R.data', size: R.type.size, })
            return [
                Algebra.assign(temp, Algebra.divide(sR, determinant)),
                Algebra.assign(sR, temp)
            ]
        }).flat(Number.POSITIVE_INFINITY)

        return [
            adjugate.join('\n'),
            determinant.join('\n'),
            inverse.join('\n'),
        ].join('\n')

    }
}
