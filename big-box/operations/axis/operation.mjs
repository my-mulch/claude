import Algebra from '../../algebra'

import { loop, index } from '../../operations/utils'

export default class ElementOperation {
    constructor(A, B, R, meta, operation = function () { return {} }) {
        this.A = A
        this.B = B
        this.R = R

        this.axes = {}
        this.axes.A = [...new Array(this.A.shape.length).keys()]
        this.axes.I = meta.axes || [...new Array(this.A.shape.length).keys()]
        this.axes.R = this.axes.A.filter(function (axis) { return !this.axes.I.includes(axis) }, this)

        this.totalAxes = [...new Array(this.A.shape.length).keys()]
        this.innerAxes = meta.axes || [...new Array(this.A.shape.length).keys()]
        this.outerAxes = this.totalAxes.filter(function (axis) { return !this.innerAxes.includes(axis) }, this)

        this.totalSize = this.totalAxes.reduce(function (size, axis, i) { return size.concat(size[i] * this.A.shape[axis]) }.bind(this), [1])
        this.innerSize = this.innerAxes.reduce(function (size, axis) { return size * this.A.shape[axis] }.bind(this), 1)
        this.outerSize = this.outerAxes.reduce(function (size, axis) { return size * this.A.shape[axis] }.bind(this), 1)

        this.outerLoops = this.outerAxes.map(symbolicLoop, this.A)
        this.innerLoops = this.innerAxes.map(symbolicLoop, this.A)

        this.indices = {}

        this.indices.A = symbolicIndex(
            'let AIndex = A.offset',
            [...this.totalAxes.keys()].map(function (axis) { return `A.strides[${axis}]` }),
            this.totalAxes.map(function (axis) { return `i${axis}` })
        )

        this.indices.R = symbolicIndex(
            'let RIndex = R.offset',
            [...this.outerAxes.keys()].map(function (axis) { return `R.strides[${axis}]` }),
            this.outerAxes.map(function (axis) { return `i${axis}` })
        )

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
