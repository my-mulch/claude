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
            sT, sA, sR,
            Aindex, Bindex, Rindex,
            innerSize, outerSize, totalSize,
            innerLoops, outerLoops, totalLoops,
            innerLoopAxes, totalLoopAxes, outerLoopAxes,
        } = symbolicInit(A, B, R, meta)

        return new Function('A, B, R', [
            `const temp = new Array(${A.type.size})`,
            ...outerLoops,
            Rindex,
            `temp.fill(Number.POSITIVE_INFINITY)`,
            ...innerLoops,
            Aindex,
            `if${Algebra.min(sA, sT).reduce(function (logic, comparison) {
                return `${logic} && ${comparison}`
            })}`,
            ...Algebra.assign(sT, sA),
            '}'.repeat(innerLoopAxes.length),
            ...Algebra.assign(sR, sT),
            '}'.repeat(outerLoopAxes.length),
            'return R'
        ].join('\n'))
    }
}





