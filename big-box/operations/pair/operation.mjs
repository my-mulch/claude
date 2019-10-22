import Operation from '../operation'
import { __Math__ } from '../../resources'
import { symbolicLoop, symbolicIndex, nonZeroAxes } from '../../operations/utils'

export default class PairOperation extends Operation {
    constructor(operation) {
        super()
        
        this.operation = operation.bind(this)
    }

    create(A, B, R, axes) {
        this.initialize(A, B, R, axes)

        return this.symbolic(this.operation())
    }

    initialize(A, B, R, axes) {
        this.totalLoopAxes = [...new Array(Math.max(A.shape.length, B.shape.length)).keys()]
        this.totalLoops = totalLoopAxes.map(symbolicLoop, R)

        const RA = this.totalLoopAxes
        const AA = totalLoopAxes.slice().reverse().filter(nonZeroAxes, A).reverse()
        const BA = totalLoopAxes.slice().reverse().filter(nonZeroAxes, B).reverse()

        this.RI = symbolicIndex('R', RA, true)
        this.AI = symbolicIndex('A', AA, A.shape.length === R.shape.length)
        this.BI = symbolicIndex('B', BA, B.shape.length === R.shape.length)

        this.A = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: A.type.size })
        this.B = Algebra.variable({ symbol: 'B.data', index: 'BIndex', size: B.type.size })
        this.R = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: R.type.size })
    }

    resultant(A, B, R, axes) {
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

    symbolic(inside) {
        return new Function('A, B, R', [
            ...this.totalLoops,
            this.AI, this.BI, this.RI,
            inside,
            '}'.repeat(this.totalLoopAxes.length),
            'return R'
        ].join('\n'))
    }
}