import Algebra from '../algebra'

import { symbolicLoop, symbolicIndex } from '../../operations/utils'

export default class ElementOperation {
    constructor(A, B, R, meta, operation = function () { return {} }) {
        this.A = A
        this.B = B
        this.R = R

        this.totalAxes = [...new Array(this.A.shape.length).keys()]
        this.innerAxes = meta.axes || [...new Array(this.A.shape.length).keys()]
        this.outerAxes = this.totalAxes.filter(function (axis) { return !this.innerAxes.includes(axis) }, this)

        this.outerLoops = this.outerAxes.map(symbolicLoop, this.A)
        this.innerLoops = this.innerAxes.map(symbolicLoop, this.A)

        this.innerSize = this.innerAxes.reduce(function (size, axis) { return size * this.A.shape[axis] }.bind(this), 1)

        this.indices = {}
        this.indices.A = symbolicIndex('A', [...this.totalAxes.keys()], this.totalAxes.map(function (axis) { return `i${axis}` }))
        this.indices.R = symbolicIndex('R', [...this.outerAxes.keys()], this.outerAxes.map(function (axis) { return `i${axis}` }))

        this.variables = {}
        this.variables.T = Algebra.variable({ symbol: 'temp', index: '0', size: this.R.type.size })
        this.variables.A = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: A.type.size })
        this.variables.R = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: this.R.type.size })

        this.operation = operation.call(this)

        this.source = this.symbolicSource()
        this.method = new Function('A,B,R', `${this.source}; return R`)

        this.invoke = this.method
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
            this.outerLoops.join('\n'),
            this.indices.R,
            this.operation.before,
            this.innerLoops.join('\n'),
            this.indices.A,
            this.operation.inside,
            '}'.repeat(this.innerAxes.length),
            this.operation.after,
            '}'.repeat(this.outerAxes.length),
        ].join('\n')
    }
}
