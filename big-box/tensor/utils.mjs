import { __Math__, PARSE_NUMBER_REGEX, NUMERIC_SYMBOLS, SPACE_REGEX } from '../resources'

export const isTypedArray = function ({ data }) {
    return data.constructor === Float32Array
        || data.constructor === Int8Array
        || data.constructor === Int16Array
        || data.constructor === Int32Array
        || data.constructor === Uint8Array
        || data.constructor === Uint16Array
        || data.constructor === Uint32Array
        || data.constructor === Uint8ClampedArray
}

export const parseNumber = function (number) {
    return String(number)
        .match(PARSE_NUMBER_REGEX)
        .map(removeSpaces)
        .map(Number)
}

export const stringNumber = function ({ index, array }) {
    let string = ''

    for (let i = 0; i < array.type.size; i++) {
        let number = array.data[index + i]
        const sign = Math.sign(number) < 0 ? '-' : '+'
        number = Math.abs(number)

        if (i === 0) {
            string += `${sign === '-' ? sign : ''}${number}`
            continue
        }

        string += `${sign}${number}${NUMERIC_SYMBOLS[i]}`
    }

    return string
}

export const removeSpaces = function (string) {
    return string.replace(SPACE_REGEX, "")
}


export const shapeRaw = function ({ data, shape = [] }) {
    if (data.constructor !== Array)
        return shape

    return shapeRaw({
        data: data[0],
        shape: shape.concat(data.length)
    })
}

export const shapeAlign = function ({ short, delta }) {
    return short.reshape({
        shape: new Array(delta)
            .fill(1)
            .concat(short.shape)
    })
}

function axesToShape(axis) { return this.shape[axis] }

export const selfAxesAndShape = function ({ axes = [...this.shape.keys()] }) {
    const axesSet = new Set(axes)
    const axesShape = axes
    const axesSize = axes.map(axesToShape, this).reduce(__Math__.multiply)
    const resultShape = []
    const alignedShape = []

    for (let i = 0; i < this.shape.length; i++)
        if (!axesSet.has(i)) {
            axesShape.push(i)
            resultShape.push(this.shape[i])
            alignedShape.push(this.shape[i])
        } else
            alignedShape.push(1)

    return {
        resultShape,
        alignedShape,
        axesShape,
        axesSize,
        fullShape: this.shape,
        fullSize: this.size
    }
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
