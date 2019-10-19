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
            `const temp = new Array(${A.type.size})`,
            ...outerLoops,
            RIndex,
            `temp.fill(0)`,
            ...innerLoops,
            AIndex,
            ...Algebra.assign(sT, sA, '+='),
            '}'.repeat(innerLoopAxes.length),
            ...Algebra.assign(sR, sT),
            '}'.repeat(outerLoopAxes.length),
            'return R'
        ].join('\n'))
    }
}





