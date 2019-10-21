import Algebra from '../../algebra'
import { symbolicInit } from '../utils'
import { __Math__ } from '../../resources'

export default {
    test: function (A, B, R, axes) {
        switch (true) {
            default: return this.symbolic(A, B, R, axes)
        }
    },

    resultant: function (A, B, R, axes = []) {
        const maxLen = __Math__.max(A.shape.length, B.shape.length)
        const shape = []

        for (let i = 0; i < maxLen; i++) {
            const bi = B.shape.length - 1 - i
            const ai = A.shape.length - 1 - i

            if (B.shape[bi] === 1 || B.shape[bi] === undefined)
                shape.push(A.shape[ai])

            else if (A.shape[ai] === 1 || A.shape[ai] === undefined)
                shape.push(B.shape[bi])

            else if (B.shape[bi] === A.shape[ai])
                shape.push(A.shape[ai])
        }

        return { shape: shape.reverse(), type: A.type }
    },

    symbolic: function (A, B, R, axes = []) {
        const {
            sA, sB, sR, sT,
            AIndex, BIndex, RIndex,
            innerSize, outerSize, totalSize,
            innerLoops, outerLoops, totalLoops,
            ANonZeroAxes, BNonZeroAxes, RNonZeroAxes,
            innerLoopAxes, totalLoopAxes, outerLoopAxes,
        } = symbolicInit(A, B, R, axes)

        return new Function('A, B, R', [
            ...totalLoops,
            AIndex,
            BIndex,
            RIndex,

            ...Algebra.assign(sR, Algebra.multiply(sA, sB)),

            '}'.repeat(totalLoopAxes.length),

            'return R'
        ].join('\n'))
    }
}
