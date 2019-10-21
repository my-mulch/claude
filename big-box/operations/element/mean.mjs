import Algebra from '../../algebra'
import { symbolicInit } from '../utils'

export default {
    test: function (A, B, R, axes) {
        switch (true) {
            default: return this.symbolic(A, B, R, axes)
        }
    },

    resultant: function (A, B, R, axes = [...A.shape.keys()]) {
        return {
            type: A.type,
            shape: A.shape.filter(function (_, axis) {
                return !axes.includes(axis)
            }),
        }
    },

    symbolic: function (A, B, R, axes = [...A.shape.keys()]) {
        const {
            sA, sB, sR, sT,
            AIndex, BIndex, RIndex,
            innerSize, outerSize, totalSize,
            innerLoops, outerLoops, totalLoops,
            ANonZeroAxes, BNonZeroAxes, RNonZeroAxes,
            innerLoopAxes, totalLoopAxes, outerLoopAxes,
        } = symbolicInit(A, B, R, axes)

        return new Function('A, B, R', [
            `const temp = new Array(${A.type.size})`,
            ...outerLoops,
            RIndex,
            `temp.fill(0)`,
            ...innerLoops,
            AIndex,
            ...Algebra.assign(sT, sA, '+='),
            '}'.repeat(innerLoopAxes.length),
            ...Algebra.assign(sR, sT.map(function (temp) { return `${temp} / ${innerSize}` })),
            '}'.repeat(outerLoopAxes.length),
            'return R'
        ].join('\n'))
    }
}





