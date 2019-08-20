import { flatToN } from './utils.mjs'
import { assignment, multiplication } from '../../../operations'

export default function (args) {
    const rows = args.of.shape[0],
        cols = args.with.shape[1],
        shared = args.of.shape[1],
        dotOps = [...new Array(rows * cols).keys()]

    return new Function('args', [
        dotOps.map(function (i) {
            const offsets = flatToN({
                indices: [
                    Math.floor(i / cols) % rows,
                    Math.floor(i / 1) % cols
                ]
            })


            const ri = args.result.offset
                + r * args.result.strides[0]
                + c * args.result.strides[1]

            const innerDots = [...new Array(shared).keys()].map(function (s) {
                const ofIndex = args.of.offset
                    + r * args.of.strides[0]
                    + s * args.of.strides[1]

                const withIndex = args.with.offset
                    + c * args.with.strides[1]
                    + s * args.with.strides[0]

                if (args.of.type.name.startsWith('Real'))
                    return multiplication.op({
                        oR: `args.of.data[${ofIndex}]`,
                        wR: `args.with.data[${withIndex}]`,
                        rR: `var sr${s}`,
                    })

                else if (args.of.type.name.startsWith('Complex'))
                    return multiplication.op({
                        oR: `args.of.data[${ofIndex}]`,
                        oI: `args.of.data[${ofIndex + 1}]`,

                        wR: `args.with.data[${withIndex}]`,
                        wI: `args.with.data[${withIndex + 1}]`,

                        rR: `var sr${s}`,
                        rI: `var si${s}`,
                    })

                else if (args.of.type.name.startsWith('Quat'))
                    return multiplication.op({
                        oR: `args.of.data[${ofIndex}]`,
                        oI: `args.of.data[${ofIndex + 1}]`,
                        oJ: `args.of.data[${ofIndex + 2}]`,
                        oK: `args.of.data[${ofIndex + 3}]`,

                        wR: `args.with.data[${withIndex}]`,
                        wI: `args.with.data[${withIndex + 1}]`,
                        wJ: `args.with.data[${withIndex + 2}]`,
                        wK: `args.with.data[${withIndex + 3}]`,

                        rR: `var sr${s}`,
                        rI: `var si${s}`,
                        rJ: `var sj${s}`,
                        rK: `var sk${s}`,
                    })

            })

            let sumDots = null

            if (args.of.type.name.startsWith('Quat'))
                sumDots = assignment.op({
                    wR: [...new Array(shared).keys()].map(function (s) { return `sr${s}` }).join('+'),
                    wI: [...new Array(shared).keys()].map(function (s) { return `si${s}` }).join('+'),
                    wJ: [...new Array(shared).keys()].map(function (s) { return `sj${s}` }).join('+'),
                    wK: [...new Array(shared).keys()].map(function (s) { return `sk${s}` }).join('+'),

                    rR: `args.result.data[${ri}]`,
                    rI: `args.result.data[${ri + 1}]`,
                    rJ: `args.result.data[${ri + 2}]`,
                    rK: `args.result.data[${ri + 3}]`,
                })

            else if (args.of.type.name.startsWith('Complex'))
                sumDots = assignment.op({
                    wR: [...new Array(shared).keys()].map(function (s) { return `sr${s}` }).join('+'),
                    wI: [...new Array(shared).keys()].map(function (s) { return `si${s}` }).join('+'),

                    rR: `args.result.data[${ri}]`,
                    rI: `args.result.data[${ri + 1}]`,
                })

            else if (args.of.type.name.startsWith('Real'))
                sumDots = assignment.op({
                    wR: [...new Array(shared).keys()].map(function (s) { return `sr${s}` }).join('+'),
                    rR: `args.result.data[${ri}]`,
                })

            return [
                ...innerDots,
                sumDots
            ].join('\n')

        }).join('\n'),


        `return args.result`

    ].join('\n'))
}
