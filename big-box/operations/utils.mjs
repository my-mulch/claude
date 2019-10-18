import Algebra from '../algebra'

export const symbolicInit = function (A, B, R, meta) {
    const innerLoopAxes = meta.axes
    const totalLoopAxes = [...new Array(A.shape.length).keys()]
    const outerLoopAxes = totalLoopAxes.filter(function (axis) { return !meta.axes.includes(axis) })

    const innerSize = innerLoopAxes.reduce(function (size, axis) { return size * A.shape[axis] }, 1)
    const outerSize = outerLoopAxes.reduce(function (size, axis) { return size * A.shape[axis] }, 1)
    const totalSize = totalLoopAxes.reduce(function (size, axis) { return size * A.shape[axis] }, 1)

    const innerLoops = innerLoopAxes.map(symbolicLoop, A)
    const outerLoops = outerLoopAxes.map(symbolicLoop, A)
    const totalLoops = totalLoopAxes.map(symbolicLoop, A)

    const Aindex = symbolicIndex('A', totalLoopAxes)
    const Bindex = symbolicIndex('B', totalLoopAxes)
    const Rindex = symbolicIndex('R', outerLoopAxes)

    const sT = Algebra.variable({ symbol: 'temp', index: '0', size: A.type.size })
    const sA = Algebra.variable({ symbol: 'A.data', index: 'Aindex', size: A.type.size })
    const sB = Algebra.variable({ symbol: 'B.data', index: 'Bindex', size: B.type.size })
    const sR = Algebra.variable({ symbol: 'R.data', index: 'Rindex', size: R.type.size })

    return {
        sT, sA, sR,
        Aindex, Bindex, Rindex,
        innerSize, outerSize, totalSize,
        innerLoops, outerLoops, totalLoops,
        innerLoopAxes, totalLoopAxes, outerLoopAxes,
    }
}
export const symbolicLoop = function (axis) {
    return `for(let i${axis}=0; i${axis} < ${this.shape[axis]}; i${axis}++){`
}

export const symbolicIndex = function (name, axes, aligned) {
    return axes.reduce(function (symbol, axis, i) {
        return `${symbol} + ${name}.strides[${aligned ? axis : i}] * i${axis}`
    }, `const ${name}index = ${name}.offset`)
}


export const shapeAlign = function ({ short, delta }) {
    return short.reshape({
        shape: new Array(delta)
            .fill(1)
            .concat(short.shape)
    })
}

export const pairAxesAndShape = function (args) {
    const axesMatch = []
    const axesMismatch = []
    const fullShape = []

    const ofShape = this.shape
    const withShape = args.with.shape || this.shape

    for (let i = 0; i < ofShape.length; i++)
        if (ofShape[i] === 1) {
            axesMismatch.push(i)
            fullShape.push(withShape[i])
        }

        else if (withShape[i] === 1) {
            axesMismatch.push(i)
            fullShape.push(ofShape[i])
        }

        else if (ofShape[i] === withShape[i]) {
            axesMatch.push(i)
            fullShape.push(ofShape[i])
        }

    const axesShape = axesMismatch.concat(axesMatch)

    return {
        fullShape,
        axesShape,
        axesSize: axesShape.map(axesToShape, this).reduce(__Math__.multiply),
        fullSize: fullShape.reduce(__Math__.multiply),
    }
}
