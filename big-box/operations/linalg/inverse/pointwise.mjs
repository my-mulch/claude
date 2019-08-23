import { cofactors } from './utils.mjs'

export default function (args) {
    const adjoint = [],
        size = Math.sqrt(args.of.size),
        template = [...new Array(args.of.size).keys()]

    for (let i = 0; i < args.result.size; i++) {
        const r = Math.floor(i / size)
        const c = i % size

        // Compute the transpose of the ADJOINT by swapping r, c
        const cofactorsRC = cofactors({ data: template, r: c, c: r })
    }

    return new Function('args', [
        ...adjoint,
        ...determinant,
        ...inverse,
        `return args.result`
    ].join('\n'))
}
