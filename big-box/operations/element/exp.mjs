import Algebra from '../../algebra'
import { symbolicInit } from '../utils'

export default {
    test: function (A, B, R, meta) {
        switch (A.type.size) {
            case 1: return this.symbolicReal(A, B, R, meta)
            case 2: return this.symbolicComplex(A, B, R, meta)
        }
    },

    symbolicReal: function (A, B, R, meta) {
        const {
            sA, sB, sR, sT,
            AIndex, BIndex, RIndex,
            innerSize, outerSize, totalSize,
            innerLoops, outerLoops, totalLoops,
            ANonZeroAxes, BNonZeroAxes, RNonZeroAxes,
            innerLoopAxes, totalLoopAxes, outerLoopAxes,
        } = symbolicInit(A, B, R, meta)

        return new Function('A, B, R', [
            ...outerLoops,
            RIndex,
            ...innerLoops,
            AIndex,
            ...Algebra.assign(sR, Algebra.exp(sA)),
            '}'.repeat(innerLoopAxes.length),
            '}'.repeat(outerLoopAxes.length),
            'return R'
        ].join('\n'))
    },

    symbolicComplex: function (A, B, R, meta) {
        const {
            sA, sB, sR, sT,
            AIndex, BIndex, RIndex,
            innerSize, outerSize, totalSize,
            innerLoops, outerLoops, totalLoops,
            ANonZeroAxes, BNonZeroAxes, RNonZeroAxes,
            innerLoopAxes, totalLoopAxes, outerLoopAxes,
        } = symbolicInit(A, B, R, meta)

        return new Function('A, B, R', [
            ...outerLoops,
            RIndex,
            ...innerLoops,
            AIndex,
            ...Algebra.assign(sR, [Math.cos(sA[0]), Math.sin(sA[1])]),
            '}'.repeat(innerLoopAxes.length),
            '}'.repeat(outerLoopAxes.length),
            'return R'
        ].join('\n'))
    }
}





