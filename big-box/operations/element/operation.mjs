import Algebra from '../algebra'

import { symbolicLoop, symbolicIndex } from '../../operations/utils'

export default class ElementOperation {
    constructor(A, B, R, axes, operation) {
        this.A = A
        this.B = B
        this.R = R

        /** Symbolic Element Operation */
        this.symbolic = {}
        this.symbolic.totalLoopAxes = [...new Array(this.A.shape.length).keys()]
        this.symbolic.innerLoopAxes = axes || [...new Array(this.A.shape.length).keys()]
        this.symbolic.outerLoopAxes = this.symbolic.totalLoopAxes.filter(function (axis) {
            return !this.symbolic.innerLoopAxes.includes(axis)
        }, this)

        this.symbolic.outerLoops = this.symbolic.outerLoopAxes.map(symbolicLoop, this.A)
        this.symbolic.innerLoops = this.symbolic.innerLoopAxes.map(symbolicLoop, this.A)

        this.symbolic.innerSize = this.symbolic.innerLoopAxes.reduce(function (size, axis) {
            return size * this.A.shape[axis]
        }.bind(this), 1)

        this.symbolic.indices = {}
        this.symbolic.indices.A = symbolicIndex('A', this.symbolic.totalLoopAxes, true)
        this.symbolic.indices.R = symbolicIndex('R', this.symbolic.outerLoopAxes, false)

        this.symbolic.variables = {}
        this.symbolic.variables.T = Algebra.variable({ symbol: 'temp', index: '0', size: this.R.type.size })
        this.symbolic.variables.A = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: A.type.size })
        this.symbolic.variables.R = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: this.R.type.size })

        this.symbolic.operation = operation.call(this)

        this.symbolic.source = this.symbolicSource()
        this.symbolic.method = new Function('A,B,R', `${this.symbolic.source}; return R`)

        this.invoke = this.symbolic.method
    }

    static resultant(A, B, R, { axes = [...new Array(A.shape.length).keys()] }) {
        return {
            type: A.type,
            shape: A.shape.filter(function (_, axis) {
                return !axes.includes(axis)
            })
        }
    }

    symbolicSource() {
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
        ].join('\n')
    }
}
