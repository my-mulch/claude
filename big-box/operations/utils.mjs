
export const symLoops = function (axis) {
    return `for(let a${axis} = 0; 
                a${axis} < args.meta.fullShape[${axis}]; 
                a${axis}++){`
}

export const symIndices = function ({ meta, ...arrays }) {
    return Object.entries(arrays).map(function ([name, array]) {
        if (!array.shape) return ''

        const assign = `${name}Index = `
        const offset = `args.${name}.offset + `
        const dimens = meta.axesShape.map(function (axis) {
            return array.shape[axis] > 1
                ? `a${axis} * args.${name}.strides[${axis}]`
                : 0
        })

        return assign + offset + dimens.join('+') || 0
    })
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
