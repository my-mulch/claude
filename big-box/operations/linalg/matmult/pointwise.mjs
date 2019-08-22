
export default function (args) {
    const rows = args.of.shape[0],
        cols = args.with.shape[1],
        shared = args.of.shape[1],
        dotOps = [...new Array(rows * cols).keys()]

    return new Function('args', [
        dotOps.map(function (i) {
            const r = Math.floor(i / cols) % rows
            const c = Math.floor(i / 1) % cols

            const resultIndex = args.result.offset
                + r * args.result.strides[0]
                + c * args.result.strides[1]

            const innerDots = [...new Array(shared).keys()].map(function (s) {
                const ofIndex = args.of.offset
                    + r * args.of.strides[0]
                    + s * args.of.strides[1]

                const withIndex = args.with.offset
                    + c * args.with.strides[1]
                    + s * args.with.strides[0]
            })

            let sumDots = null

            return [
                ...innerDots,
                sumDots
            ].join('\n')
        }).join('\n'),

        `return args.result`
    ].join('\n'))
}
