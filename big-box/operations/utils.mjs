import Algebra from '../algebra'

export const symbolicInit = function (A, B, R, meta) {
    const innerLoopAxes = meta.axes
    const totalLoopAxes = [...new Array(Math.max(A.shape.length, B.shape.length, R.shape.length)).keys()]
    const outerLoopAxes = totalLoopAxes.filter(function (axis) { return !meta.axes.includes(axis) })

    const ANonZeroAxes = totalLoopAxes.slice().reverse().filter(nonZeroAxis, A).reverse()
    const BNonZeroAxes = totalLoopAxes.slice().reverse().filter(nonZeroAxis, B).reverse()
    const RNonZeroAxes = outerLoopAxes.slice().reverse().filter(nonZeroAxis, R).reverse()

    const innerSize = innerLoopAxes.reduce(function (size, axis) { return size * A.shape[axis] }, 1)
    const outerSize = outerLoopAxes.reduce(function (size, axis) { return size * A.shape[axis] }, 1)
    const totalSize = totalLoopAxes.reduce(function (size, axis) { return size * A.shape[axis] }, 1)

    const innerLoops = innerLoopAxes.map(symbolicLoop, A)
    const outerLoops = outerLoopAxes.map(symbolicLoop, A)
    const totalLoops = totalLoopAxes.map(symbolicLoop, R)

    const AIndex = symbolicIndex('A', ANonZeroAxes, true)
    const BIndex = symbolicIndex('B', BNonZeroAxes, B.shape.length === R.shape.length)
    const RIndex = symbolicIndex('R', RNonZeroAxes, R.shape.length === A.shape.length)

    const sT = Algebra.variable({ symbol: 'temp', index: '0', size: R.type.size })
    const sA = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: A.type.size })
    const sB = Algebra.variable({ symbol: 'B.data', index: 'BIndex', size: B.type.size })
    const sR = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: R.type.size })

    return {
        sA, sB, sR, sT,
        AIndex, BIndex, RIndex,
        innerSize, outerSize, totalSize,
        innerLoops, outerLoops, totalLoops,
        ANonZeroAxes, BNonZeroAxes, RNonZeroAxes,
        innerLoopAxes, totalLoopAxes, outerLoopAxes,
    }
}
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
