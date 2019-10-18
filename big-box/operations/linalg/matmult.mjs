import Algebra from '../../algebra'

export default {
    test: function (A, B, R, meta) {
        switch (true) {
            default: return this.pointwise(A, B, R, meta)
        }
    },

    pointwise: function (A, B, R, meta) {
        const operations = [], rows = A.shape[0], cols = B.shape[1], shared = A.shape[1]

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const sR = Algebra.variable({ symbol: 'R.data', size: R.type.size, index: R.header.flatIndex([r, c]) })

                const innerProduct = new Array(shared).fill(null).map(function (_, s) {
                    const sA = Algebra.variable({ symbol: 'A.data', size: A.type.size, index: A.header.flatIndex([r, s]) })
                    const sB = Algebra.variable({ symbol: 'B.data', size: B.type.size, index: B.header.flatIndex([s, c]) })

                    return Algebra.multiply(sA, sB)
                }).reduce(Algebra.add)

                operations.push(Algebra.assign(sR, innerProduct))
            }
        }

        return new Function('A, B, R', [operations.flat(Number.POSITIVE_INFINITY).join('\n'), `return R`].join('\n'))
    }
}
