
export const result = function (A, B, R, axes = [...A.shape.keys()]) {
    return {
        type: A.type,
        shape: A.shape.filter(function (_, axis) { return !axes.includes(axis) })
    }
}

export const select = function (A, B, R, axes) {
    return symbolic
}

export const symbolic = function ({ before, inside, after }) {
    return new Function('A, B, R', [
        `const temp = new Array(${A.type.size})`,
        ...this.outerLoops,
        this.RI,
        before,
        ...this.innerLoops,
        this.AI,
        inside,
        '}'.repeat(this.innerLoopAxes.length),
        after,
        '}'.repeat(this.outerLoopAxes.length),
        'return R'
    ].join('\n'))
}

