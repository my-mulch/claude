import Algebra from '../../algebra'
import { symbolicInit } from '../utils'

export default {
    test: function (A, B, R, meta) {
        switch (true) {
            default: return this.symbolic(A, B, R, meta)
        }
    },

    symbolic: function (A, B, R, meta) {
        const {
            sA, sB, sR, sT,
            AIndex, BIndex, RIndex,
            innerSize, outerSize, totalSize,
            innerLoops, outerLoops, totalLoops,
            ANonZeroAxes, BNonZeroAxes, RNonZeroAxes,
            innerLoopAxes, totalLoopAxes, outerLoopAxes,
        } = symbolicInit(A, B, R, meta)

        return new Function('A, B, R', [
            ...totalLoops,
            AIndex,
            BIndex,
            RIndex,

            ...Algebra.assign(sR, Algebra.add(sA, sB)),

            '}'.repeat(totalLoopAxes.length),

            'return R'
        ].join('\n'))
    }
}
