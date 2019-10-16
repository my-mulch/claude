import Algebra from '../../algebra'

export default function (args) {
    const operations = [],
        rows = args.of.shape[0],
        cols = args.with.shape[1],
        shared = args.of.shape[1]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const ri = args.result.offset + r * args.result.strides[0] + c * args.result.strides[1]
            const R = Algebra.variable({ symbol: 'args.result.data', size: args.result.type.size, index: ri })

            const innerProduct = new Array(shared).fill(null).map(function (_, s) {
                const oi = args.of.offset + r * args.of.strides[0] + s * args.of.strides[1]
                const wi = args.with.offset + c * args.with.strides[1] + s * args.with.strides[0]

                const O = Algebra.variable({ symbol: 'args.of.data', size: args.of.type.size, index: oi })
                const W = Algebra.variable({ symbol: 'args.with.data', size: args.with.type.size, index: wi })

                return Algebra.multiply(O, W)
            }).reduce(Algebra.add)


            operations.push(Algebra.assign(R, innerProduct))
        }
    }

    return new Function('args', [operations.flat(Number.POSITIVE_INFINITY).join('\n'), `return args.result`].join('\n'))
}
