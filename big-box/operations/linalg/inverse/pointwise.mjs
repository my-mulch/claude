import { cofactors, template, survivors } from './utils.mjs'
import util from 'util'

export default function (args) {
    const adjoint = [],
        size = Math.sqrt(args.of.size),
        indices = template({ size })

    for (let i = 0; i < args.result.size; i++) {
        const r = Math.floor(i / size)
        const c = i % size
        const sign = Math.pow(-1, (r + c) % 2)

        // Compute the ADJOINT MATRIX by swapping r, c of COFACTOR MATRIX
        const survivorsRC = survivors({ indices, r: c, c: r })
        const cofactorsRC = cofactors({ indices: survivorsRC, array: args.of })
        return console.log(util.inspect(cofactorsRC, false, null, true))
    }

    return new Function('args', [
        ...adjoint,
        ...determinant,
        ...inverse,
        `return args.result`
    ].join('\n'))
}
