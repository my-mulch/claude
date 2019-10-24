import Operation from '../operation'
import Algebra from '../../algebra'

export default class CrossProduct extends Operation {
    create(A, B, R, meta) { return this.pointwise(A, B, R, meta) }
    resultant(A, B, R, meta) { return { shape: [3, 1], type: A.type } }

    pointwise(A, B, R, meta) {
        const sA = [], sB = [], sR = []

        for (let i = 0; i < 3; i++) {
            sA.push(Algebra.variable({ symbol: 'A.data', index: A.header.flatIndex([i, 0]), size: A.type.size }))
            sB.push(Algebra.variable({ symbol: 'B.data', index: B.header.flatIndex([i, 0]), size: B.type.size }))
            sR.push(Algebra.variable({ symbol: 'R.data', index: R.header.flatIndex([i, 0]), size: R.type.size }))
        }

        return [
            ...Algebra.assign(sR[0], Algebra.add(Algebra.negate(Algebra.multiply(sA[2], sB[1])), Algebra.multiply(sB[2], sA[1]))),
            ...Algebra.assign(sR[1], Algebra.add(Algebra.negate(Algebra.multiply(sA[0], sB[2])), Algebra.multiply(sB[0], sA[2]))),
            ...Algebra.assign(sR[2], Algebra.subtract(Algebra.multiply(sA[0], sB[1]), Algebra.multiply(sB[0], sA[1]))),
        ]
    }
}
