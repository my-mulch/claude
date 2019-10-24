import Operation from '../operation'
import { symbolicLoop, symbolicIndex } from '../../operations/utils'

export default class ElementOperation extends Operation {
    constructor(A, B, R, axes, operation) {
        super()

        this.A = A
        this.B = B
        this.R = R

        /** Symbolic Element Operation */
        this.symbolic.operation = operation

        this.symbolic.innerLoopAxes = axes
        this.symbolic.totalLoopAxes = [...new Array(this.A.shape.length).keys()]
        this.symbolic.outerLoopAxes = this.symbolic.totalLoopAxes.filter(function (axis) { return !axes.includes(axis) })

        this.symbolic.innerSize = this.symbolic.innerLoopAxes.reduce(function (size, axis) { return size * this.A.shape[axis] }, 1)
        this.symbolic.innerLoops = this.symbolic.innerLoopAxes.map(symbolicLoop, this.A)
        this.symbolic.outerLoops = this.symbolic.outerLoopAxes.map(symbolicLoop, this.A)

        this.symbolic.indices.A = symbolicIndex('A', this.symbolic.innerLoopAxes, true)
        this.symbolic.indices.R = symbolicIndex('R', this.symbolic.outerLoopAxes, false)

        this.symbolic.variables.T = Algebra.variable({ symbol: 'temp', index: '0', size: this.R.type.size })
        this.symbolic.variables.A = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: A.type.size })
        this.symbolic.variables.R = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: this.R.type.size })

        this.symbolic.source = this.symbolic()
        this.symbolic.method = new Function('A,B,R', `${this.symbolic.source}; return R`)
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
            `const temp = new Array(${this.A.type.size})`,
            this.symbolic.outerLoops.join('\n'),
            this.symbolic.indices.R,
            this.symbolic.operation.before,
            this.symbolic.innerLoops.join('\n'),
            this.symbolic.indices.A,
            this.symbolic.operation.inside,
            '}'.repeat(this.symbolic.innerLoopAxes.length),
            this.symbolic.operation.after,
            '}'.repeat(this.symbolic.outerLoopAxes.length),
            'return R'
        ].join('\n')
    }
}
