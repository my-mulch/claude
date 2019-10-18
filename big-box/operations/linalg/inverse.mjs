import Algebra from '../../algebra'
import { cofactors, template, survivors } from './cofactors.mjs'

export default {
    test: function (A, B, R, meta) {
        switch (true) {
            default: return this.pointwise(A, B, R, meta)
        }
    },

    pointwise: function (A, B, R, meta) {
        const size = Math.sqrt(A.size),
            indices = template(size)

        const adjoint = new Array(size * size).fill(null).map(function (_, i) {
            const c = i % size
            const r = Math.floor(i / size)

            const sign = Math.pow(-1, (r + c) % 2)
            const cofactor = cofactors(survivors(indices, c, r), A)

            const sR = Algebra.variable({
                index: R.header.flatIndex([r, c]),
                symbol: 'R.data',
                size: R.type.size,
            })

            return Algebra.assign(sR, sign < 0 ? Algebra.negate(cofactor) : cofactor)
        }).flat(Number.POSITIVE_INFINITY)

        const determinant = Algebra.assign(['const determinant'], new Array(size).fill(null).map(function (_, i) {
            const factors = Algebra.variable({
                symbol: 'A.data',
                size: A.type.size,
                index: A.header.flatIndex([0, i])
            })

            const adjoint = Algebra.variable({
                symbol: 'R.data',
                size: A.type.size,
                index: R.header.flatIndex([i, 0])
            })

            return Algebra.multiply(factors, adjoint)
        }).reduce(Algebra.add))

        const inverse = new Array(size * size).fill(null).map(function (_, i) {
            const c = i % size
            const r = Math.floor(i / size)

            const sR = Algebra.variable({
                index: R.header.flatIndex([r, c]),
                symbol: 'R.data',
                size: R.type.size,
            })

            return Algebra.assign(sR, ['determinant'], '/=')
        }).flat(Number.POSITIVE_INFINITY)

        return new Function('A, B, R', [
            ...adjoint,
            ...determinant,
            ...inverse,
            `return R`
        ].join('\n'))
    }
}