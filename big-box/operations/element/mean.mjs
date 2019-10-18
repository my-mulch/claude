import Algebra from '../../algebra'
import { __Math__ } from '../../resources'
import { symbolicLoop, symbolicIndex } from '../utils'

export default {
    test: function (A, B, R, meta) {
        switch (true) {
            default: return this.symbolic(A, B, R, meta)
        }
    },

    symbolic: function (A, B, R, meta) {
        const innerLoopAxes = meta.axes
        const totalLoopAxes = [...new Array(A.shape.length).keys()]
        const outerLoopAxes = totalLoopAxes.filter(function (axis) { return !meta.axes.includes(axis) })

        const innerSize = innerLoopAxes.reduce(function (size, axis) { return size * A.shape[axis] }, 1)
        const outerSize = outerLoopAxes.reduce(function (size, axis) { return size * A.shape[axis] }, 1)
        const totalSize = totalLoopAxes.reduce(function (size, axis) { return size * A.shape[axis] }, 1)

        const innerLoops = innerLoopAxes.map(symbolicLoop, A)
        const outerLoops = outerLoopAxes.map(symbolicLoop, A)

        const AIndex = symbolicIndex('A', totalLoopAxes)
        const RIndex = symbolicIndex('R', outerLoopAxes)

        const sT = Algebra.variable({ symbol: 'temp', index: '0', size: A.type.size })
        const sA = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: A.type.size })
        const sR = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: R.type.size })

        return new Function('A, B, R', [
            `const temp = new Array(${A.type.size})`,

            ...outerLoops,
            RIndex,

            `temp.fill(0)`,

            ...innerLoops,
            AIndex,

            ...Algebra.assign(sT, sA, '+='),

            '}'.repeat(innerLoopAxes.length),

            ...Algebra.assign(sR, Algebra.divide(sT, new Array(A.type.size).fill(innerSize))),

            '}'.repeat(outerLoopAxes.length),

            'return R'
        ].join('\n'))
    }
}





