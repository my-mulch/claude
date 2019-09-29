import Algebra from '../../../algebra/index.mjs'
import { cofactors, template, survivors } from './utils.mjs'

export default function (args) {
    const inverse = [],
        adjoint = [],
        size = Math.sqrt(args.of.size),
        indices = template({ size })


    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const sign = Math.pow(-1, (r + c) % 2)
            const cofactor = cofactors(survivors(indices, c, r), args.of)

            const ri = args.result.offset + r * args.result.strides[0] + c * args.result.strides[1]
            const R = Algebra.variable({ symbol: 'args.result.data', size: args.result.type.size, index: ri })
        
            adjoint.push(Algebra.assign(R, sign < 0 ? Algebra.negate(cofactor) : cofactor))
        }
    }

    const determinant = Algebra.assign(['const determinant'], new Array(size).fill(null).map(function (_, i) {
        const oi = args.of.offset + i * args.of.strides[1]
        const ri = args.result.offset + i * args.result.strides[0]

        const O = Algebra.variable({ symbol: 'args.of.data', size: args.of.type.size, index: oi })
        const R = Algebra.variable({ symbol: 'args.result.data', size: args.of.type.size, index: ri })

        return Algebra.multiply(O, R)
    }).reduce(Algebra.add))

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const ri = args.result.offset + r * args.result.strides[0] + c * args.result.strides[1]
            const R = Algebra.variable({ symbol: 'args.result.data', size: args.result.type.size, index: ri })

            inverse.push(Algebra.assign(R, ['determinant'], '/='))
        }
    }

    return new Function('args', [
        ...adjoint,
        ...determinant,
        ...inverse,
        `return args.result`
    ].join('\n'))
}
