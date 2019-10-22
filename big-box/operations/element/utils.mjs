
export const result = function (A, B, R, axes = [...A.shape.keys()]) {
    return {
        type: A.type,
        shape: A.shape.filter(function (_, axis) {
            return !axes.includes(axis)
        }),
    }
}

export const symbolic = function (tempOp, innerOp, closingOp) {
    return new Function('A, B, R', [
        `const temp = new Array(${A.type.size})`,
        ...this.outerLoops,

        this.RI,
        tempOp(this),

        ...this.innerLoops,

        this.AI,
        innerOp(this),

        '}'.repeat(this.innerLoopAxes.length),

        closingOp(this),

        '}'.repeat(this.outerLoopAxes.length),

        'return R'
    ].join('\n'))
}

