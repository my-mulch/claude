import Operation from '../operation'
import { __Math__ } from '../../resources'
import { symbolicLoop, symbolicIndex, nonZeroAxes } from '../../operations/utils'

export default class PairOperation extends Operation {
    constructor(A, B, R, operation) {
        super()

        this.A = A
        this.B = B
        this.R = R

        this.operation = operation

        this.totalLoopAxes = [...new Array(Math.max(A.shape.length, B.shape.length)).keys()]
        this.totalLoops = totalLoopAxes.map(symbolicLoop, R)

        this.axes.R = this.totalLoopAxes
        this.axes.A = totalLoopAxes.slice().reverse().filter(nonZeroAxes, A).reverse()
        this.axes.B = totalLoopAxes.slice().reverse().filter(nonZeroAxes, B).reverse()

        this.indices.R = symbolicIndex('R', RA, true)
        this.indices.A = symbolicIndex('A', AA, A.shape.length === R.shape.length)
        this.indices.B = symbolicIndex('B', BA, B.shape.length === R.shape.length)

        this.variables.A = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: A.type.size })
        this.variables.B = Algebra.variable({ symbol: 'B.data', index: 'BIndex', size: B.type.size })
        this.variables.R = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: R.type.size })
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

    symbolic() {
        return [
            this.totalLoops.join('\n'),

            this.indices.AI,
            this.indices.BI,
            this.indices.RI,

            this.operation,

            '}'.repeat(this.totalLoopAxes.length),

        ].join('\n')
    }
}