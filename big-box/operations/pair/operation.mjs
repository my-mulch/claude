import Algebra from '../../algebra'
import { __Math__ } from '../../resources'
import { loop, index, nonZeroAxes } from '../../operations/utils'

export default class PairOperation {
    constructor(A, B, R, operation) {
        this.A = A
        this.B = B
        this.R = R

        this.totalAxes = [...new Array(Math.max(A.shape.length, B.shape.length)).keys()]
        this.totalLoops = this.totalAxes.map(symbolicLoop, R)

        this.axes = {}
        this.axes.R = this.totalAxes
        this.axes.A = this.totalAxes.slice().reverse().filter(nonZeroAxes, A).reverse()
        this.axes.B = this.totalAxes.slice().reverse().filter(nonZeroAxes, B).reverse()

        this.indices = {}

        this.indices.R = symbolicIndex(
            'let RIndex = R.offset',
            this.axes.R.map(function (axis) { return `R.strides[${axis}]` }),
            this.axes.R.map(function (axis) { return `i${axis}` })
        )

        this.indices.A = symbolicIndex(
            'let AIndex = A.offset',
            this.axes.A.map(function (axis) { return `A.strides[${axis}]` }),
            this.axes.A.map(function (axis) { return `i${axis}` })
        )

        this.indices.B = symbolicIndex(
            'let BIndex = B.offset',
            this.axes.B.map(function (axis) { return `B.strides[${axis}]` }),
            this.axes.B.map(function (axis) { return `i${axis}` })
        )

        this.variables = {}
        this.variables.A = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: A.type.size })
        this.variables.B = Algebra.variable({ symbol: 'B.data', index: 'BIndex', size: B.type.size })
        this.variables.R = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: R.type.size })

        this.operation = operation.call(this)

        this.source = this.symbolicSource()
        this.method = new Function('A,B,R,args', `${this.source}; return R`)

        this.invoke = this.method
    }

    static resultant(A, B) {
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
    }

    symbolicSource() {
        return [
            this.operation.before,

            this.totalLoops.join('\n'),

            this.indices.A,
            this.indices.B,
            this.indices.R,

            this.operation.inside,

            '}'.repeat(this.totalAxes.length),

            this.operation.after,

        ].join('\n')
    }
}