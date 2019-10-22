
export const symbolicLoop = function (axis) {
    return `for(let i${axis}=0; i${axis} < ${this.shape[axis]}; i${axis}++){`
}

export const symbolicIndex = function (name, axes, parity) {
    return axes.reduce(function (symbol, axis, i) {
        return `${symbol} + ${name}.strides[${parity ? axis : i}] * i${axis}`
    }, `const ${name}Index = ${name}.offset`)
}

export const nonZeroAxis = function (_, index) {
    const ri = this.shape.length - index - 1

    if (ri < 0) return false
    if (this.shape[ri] > 1) return true

    return false
}

