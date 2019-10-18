import Algebra from '../../algebra'

export default {
    test: function (A, B, R, meta) {
        switch (true) {
            default: return this.pointwise(A, B, R, meta)
        }
    },

    pointwise: function (A, B, R, meta) {
        const symbolicA = [0,], symbolicB = [0,], symbolicR = [0,]

        for (let i = 0; i < 3; i++) {
            symbolicA.push(Algebra.variable({
                symbol: 'A.data',
                index: A.header.flatIndex([i, 0]),
                size: 1
            }).pop())

            symbolicB.push(Algebra.variable({
                symbol: 'B.data',
                index: B.header.flatIndex([i, 0]),
                size: 1
            }).pop())

            symbolicR.push(Algebra.variable({
                symbol: 'R.data',
                index: R.header.flatIndex([i, 0]),
                size: 1
            }).pop())
        }

        return new Function('A, B, R', [
            Algebra
                .assign(symbolicR, Algebra.multiply(symbolicA, symbolicB))
                .slice(1)
                .join('\n'),

            `return R`
        ].join('\n'))
    }
}
