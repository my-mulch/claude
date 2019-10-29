
import Algebra from '../algebra'
import { __Math__ } from '../../resources'
import { symbolicLoop, symbolicIndex, nonZeroAxes } from '../../operations/utils'

export default class PairOperation {
    constructor(A, B, R, operation) {
        this.A = A
        this.B = B
        this.R = R

        /** Symbolic PairOperation */
        this.symbolic = {}
        this.symbolic.totalLoopAxes = [...new Array(Math.max(A.shape.length, B.shape.length)).keys()]
        this.symbolic.totalLoops = this.symbolic.totalLoopAxes.map(symbolicLoop, R)

        this.symbolic.axes = {}
        this.symbolic.axes.R = this.symbolic.totalLoopAxes
        this.symbolic.axes.A = this.symbolic.totalLoopAxes.slice().reverse().filter(nonZeroAxes, A).reverse()
        this.symbolic.axes.B = this.symbolic.totalLoopAxes.slice().reverse().filter(nonZeroAxes, B).reverse()

        this.symbolic.indices = {}
        this.symbolic.indices.R = symbolicIndex('R', this.symbolic.axes.R, true)
        this.symbolic.indices.A = symbolicIndex('A', this.symbolic.axes.A, A.shape.length === R.shape.length)
        this.symbolic.indices.B = symbolicIndex('B', this.symbolic.axes.B, B.shape.length === R.shape.length)

        this.symbolic.variables = {}
        this.symbolic.variables.A = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: A.type.size })
        this.symbolic.variables.B = Algebra.variable({ symbol: 'B.data', index: 'BIndex', size: B.type.size })
        this.symbolic.variables.R = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: R.type.size })

        this.symbolic.operation = operation.call(this)

        this.symbolic.source = this.symbolicSource()
        this.symbolic.method = new Function('A,B,R,args', `${this.symbolic.source}; return R`)

        this.invoke = this.symbolic.method
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
            this.symbolic.operation.before,
            
            this.symbolic.totalLoops.join('\n'),

            this.symbolic.indices.A,
            this.symbolic.indices.B,
            this.symbolic.indices.R,

            this.symbolic.operation.inside,

            '}'.repeat(this.symbolic.totalLoopAxes.length),
            
            this.symbolic.operation.after,

        ].join('\n')
    }
}