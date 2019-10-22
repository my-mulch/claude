import { __Math__ } from '../../resources'

export const select = function (A, B, R, axes) {
    return this.symbolic(A, B, R, axes)
}

export const symbolic = function (operation) {
    return new Function('A, B, R', [
        ...this.totalLoops,

        this.AI, this.BI, this.RI,

        operation,

        '}'.repeat(this.totalLoopAxes.length),

        'return R'
    ].join('\n'))
}

export const result = function (A, B, R, axes) {
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
