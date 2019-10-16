import Algebra from '../../algebra'
import { cofactors, template, survivors } from './cofactors.mjs'

export default function (args) {
    const size = Math.sqrt(args.of.size),
        indices = template(size)

    const adjoint = new Array(size * size).fill(null).map(function (_, i) {
        const c = i % size
        const r = Math.floor(i / size)

        const sign = Math.pow(-1, (r + c) % 2)
        const cofactor = cofactors(survivors(indices, c, r), args.of)

        const R = Algebra.variable({
            index: args.result.header.flatIndex([r, c]),
            symbol: 'args.result.data',
            size: args.result.type.size,
        })

        return Algebra.assign(R, sign < 0 ? Algebra.negate(cofactor) : cofactor)
    }).flat(Number.POSITIVE_INFINITY)

    const determinant = Algebra.assign(['const determinant'], new Array(size).fill(null).map(function (_, i) {
        const factors = Algebra.variable({
            symbol: 'args.of.data',
            size: args.of.type.size,
            index: args.of.header.flatIndex([0, i])
        })

        const adjoint = Algebra.variable({
            symbol: 'args.result.data',
            size: args.of.type.size,
            index: args.result.header.flatIndex([i, 0])
        })

        return Algebra.multiply(factors, adjoint)
    }).reduce(Algebra.add))

    const inverse = new Array(size * size).fill(null).map(function (_, i) {
        const c = i % size
        const r = Math.floor(i / size)

        const R = Algebra.variable({
            index: args.result.header.flatIndex([r, c]),
            symbol: 'args.result.data',
            size: args.result.type.size,
        })

        return Algebra.assign(R, ['determinant'], '/=')
    }).flat(Number.POSITIVE_INFINITY)

    return new Function('args', [
        ...adjoint,
        ...determinant,
        ...inverse,
        `return args.result`
    ].join('\n'))
}
