
export const intersection = function (a1, a2) {
    return a1.filter(function (value) { return a2.includes(value) })
}

export const difference = function (a1, a2) {
    return a1.filter(function (value) { return !a2.includes(value) })
}

export const loop = function (axes, tensor) {
    return axes.map(function (axis) {
        return `for(let i${axis}=0; i${axis} < ${this.shape[axis]}; i${axis}++){`
    }, tensor)
}

export const index = function (axes, tensor) {
    return axes.reduce(function (index, axis) {
        return `${index} + ${tensor.name}.strides[${axis}] * i${axis}`
    }, `let ${tensor.index} = ${tensor.name}.offset`)
}

export const nonZeroAxes = function (_, index) {
    const ri = this.shape.length - index - 1

    if (ri < 0) return false
    if (this.shape[ri] > 1) return true

    return false
}

