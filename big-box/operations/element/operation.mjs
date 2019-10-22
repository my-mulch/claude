import Operation from '../operation'
import { symbolicLoop } from '../../operations/utils'

export default class ElementOperation extends Operation {
    constructor(operation) {
        super()

        this.operation = operation.bind(this)
    }

    create(A, B, R, axes) {
        this.initialize(A, B, R, axes)

        return this.symbolic(this.operation())
    }

    initialize(A, B, R, axes) {
        this.innerLoopAxes = axes
        this.totalLoopAxes = [...new Array(A.shape.length).keys()]
        this.outerLoopAxes = totalLoopAxes.filter(function (axis) { return !axes.includes(axis) })

        this.innerSize = innerLoopAxes.reduce(function (size, axis) { return size * A.shape[axis] }, 1)
        this.innerLoops = innerLoopAxes.map(symbolicLoop, A)
        this.outerLoops = outerLoopAxes.map(symbolicLoop, A)

        this.AI = symbolicIndex('A', this.innerLoopAxes, true)
        this.RI = symbolicIndex('R', this.outerLoopAxes, false)

        this.T = Algebra.variable({ symbol: 'temp', index: '0', size: R.type.size })
        this.A = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: A.type.size })
        this.R = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: R.type.size })
    }

    resultant(A, B, R, axes) {
        return {
            type: A.type,
            shape: A.shape.filter(function (_, axis) {
                return !axes.includes(axis)
            })
        }
    }

    symbolic(before, inside, after) {
        return new Function('A, B, R', [
            `const temp = new Array(${A.type.size})`,
            ...this.outerLoops,
            this.RI,
            before,
            ...this.innerLoops,
            this.AI,
            inside,
            '}'.repeat(this.innerLoopAxes.length),
            after,
            '}'.repeat(this.outerLoopAxes.length),
            'return R'
        ].join('\n'))
    }
}