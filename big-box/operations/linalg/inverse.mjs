import Algebra from '../../algebra'
import { cofactors, template, survivors } from './adjugate.mjs'

export default class Inverse extends Operation {
    create(A, B, R, meta) { return this.pointwise(A, B, R, meta) }
    resultant(A, B, R, meta) { return { shape: A.shape, type: A.type } }
    pointwise() {
        const size = Math.sqrt(A.size)
        const indices = template(size)
        const temp = Algebra.variable({ symbol: 'temp', size: A.type.size, index: 0 })
        const determinant = Algebra.variable({ symbol: 'determinant', size: A.type.size, index: 0 })


    }
}
export default {

    pointwise: function (A, B, R, meta) {


        const adjointComputation = new Array(size * size).fill(null).map(function (_, i) {
            const c = i % size
            const r = Math.floor(i / size)

            const sign = Math.pow(-1, (r + c) % 2)
            const cofactor = cofactors(survivors(indices, c, r), A)
            const sR = Algebra.variable({ index: R.header.flatIndex([r, c]), symbol: 'R.data', size: R.type.size })

            return Algebra.assign(sR, sign < 0 ? Algebra.negate(cofactor) : cofactor)
        }).flat(Number.POSITIVE_INFINITY)

        const determinantComputation = Algebra.assign(determinant, new Array(size).fill(null).map(function (_, i) {
            const factors = Algebra.variable({ symbol: 'A.data', size: A.type.size, index: A.header.flatIndex([0, i]) })
            const cofactors = Algebra.variable({ symbol: 'R.data', size: A.type.size, index: R.header.flatIndex([i, 0]) })
            return Algebra.multiply(factors, cofactors)
        }).reduce(Algebra.add))

        const inverseComputation = new Array(size * size).fill(null).map(function (_, i) {
            const c = i % size
            const r = Math.floor(i / size)
            const sR = Algebra.variable({ index: R.header.flatIndex([r, c]), symbol: 'R.data', size: R.type.size, })
            return [
                Algebra.assign(temp, Algebra.divide(sR, determinant)),
                Algebra.assign(sR, temp)
            ]
        }).flat(Number.POSITIVE_INFINITY)

        return new Function('A, B, R', [
            `const temp = new Array(${A.type.size})`,
            `const determinant = new Array(${A.type.size})`,
            ...adjointComputation,
            ...determinantComputation,
            ...inverseComputation,
            `return R`
        ].join('\n'))
    }
}
