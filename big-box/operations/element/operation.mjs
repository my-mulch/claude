import Operation from '../operation'
import { symbolicLoop, symbolicIndex } from '../../operations/utils'

export default class ElementOperation extends Operation {
    constructor(A, B, R, axes, operation) {
        super()

        this.A = A
        this.B = B
        this.R = R

        this.operation = operation

        this.innerLoopAxes = axes
        this.totalLoopAxes = [...new Array(this.A.shape.length).keys()]
        this.outerLoopAxes = totalLoopAxes.filter(function (axis) { return !axes.includes(axis) })

        this.innerSize = innerLoopAxes.reduce(function (size, axis) { return size * this.A.shape[axis] }, 1)
        this.innerLoops = innerLoopAxes.map(symbolicLoop, this.A)
        this.outerLoops = outerLoopAxes.map(symbolicLoop, this.A)

        this.indices.A = symbolicIndex('A', this.innerLoopAxes, true)
        this.indices.R = symbolicIndex('R', this.outerLoopAxes, false)

        this.variables.T = Algebra.variable({ symbol: 'temp', index: '0', size: this.R.type.size })
        this.variables.A = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: A.type.size })
        this.variables.R = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: this.R.type.size })
    }

    static resultant(A, B, R, axes) {
        return {
            type: A.type,
            shape: A.shape.filter(function (_, axis) {
                return !axes.includes(axis)
            })
        }
    }

    symbolic() {
        return [
            `const temp = new Array(${A.type.size})`,
            this.outerLoops.join('\n'),
            this.indices.R,
            this.operation.before,
            this.innerLoops.join('\n'),
            this.indices.A,
            this.operation.inside,
            '}'.repeat(this.innerLoopAxes.length),
            this.operation.after,
            '}'.repeat(this.outerLoopAxes.length),
            'return R'
        ].join('\n')
    }
}
