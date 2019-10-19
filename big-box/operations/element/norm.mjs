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
            `let temp`,
            ...outerLoops,
            RIndex,
            `temp = 0`,
            ...innerLoops,
            AIndex,
            ...Algebra.assign(['temp'], Algebra.sumSquares(sA), '+='),
            '}'.repeat(innerLoopAxes.length),
            ...Algebra.assign(sR, Algebra.squareRoot(['temp'])),
            '}'.repeat(outerLoopAxes.length),
            'return R'
        ].join('\n'))
    }
}





