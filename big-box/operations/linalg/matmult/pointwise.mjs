
export default function (args) {
    const operations = [],
        type = args.of.type,
        rows = args.of.shape[0],
        cols = args.with.shape[1],
        shared = args.of.shape[1]

    for (let i = 0; i < rows * cols; i++) {
        const c = Math.floor(i) % cols
        const r = Math.floor(i / cols) % rows

        for (let s = 0; s < shared; s++) {
            const oi = args.of.offset + r * args.of.strides[0] + s * args.of.strides[1]
            const wi = args.with.offset + c * args.with.strides[1] + s * args.with.strides[0]
            const ri = args.result.offset + r * args.result.strides[0] + c * args.result.strides[1]

            operations.push(type.algebra.mac({ oi, wi, ri }))
        }
    }

    return new Function('args', [...operations, `return args.result`].join('\n'))
}
