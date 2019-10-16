import Algebra from '../../algebra'

export default {
    'true': function (args) {

        args.of = args.of.reshape({ shape: [3, 1] })
        args.with = args.with.reshape({ shape: [3, 1] })
        args.result = args.result.reshape({ shape: [3, 1] })

        const o1 = Algebra.variable({ symbol: 'args.of.data', index: args.of.header.flatIndex([0, 0]), size: 1 }).pop()
        const o2 = Algebra.variable({ symbol: 'args.of.data', index: args.of.header.flatIndex([0, 1]), size: 1 }).pop()
        const o3 = Algebra.variable({ symbol: 'args.of.data', index: args.of.header.flatIndex([0, 2]), size: 1 }).pop()

        const w1 = Algebra.variable({ symbol: 'args.with.data', index: args.with.header.flatIndex([0, 0]), size: 1 }).pop()
        const w2 = Algebra.variable({ symbol: 'args.with.data', index: args.with.header.flatIndex([0, 1]), size: 1 }).pop()
        const w3 = Algebra.variable({ symbol: 'args.with.data', index: args.with.header.flatIndex([0, 2]), size: 1 }).pop()

        const r1 = Algebra.variable({ symbol: 'args.result.data', index: args.result.header.flatIndex([0, 0]), size: 1 }).pop()
        const r2 = Algebra.variable({ symbol: 'args.result.data', index: args.result.header.flatIndex([0, 1]), size: 1 }).pop()
        const r3 = Algebra.variable({ symbol: 'args.result.data', index: args.result.header.flatIndex([0, 2]), size: 1 }).pop()

        return new Function('args', [
            /** First element of cross */

            Algebra
                .assign(
                    [null, r1, r2, r3],
                    Algebra.multiply([0, o1, o2, o3], [0, w1, w2, w3])
                )
                .slice(1)
                .join('\n'),

            `return args.result`
        ].join('\n'))
    }
}
