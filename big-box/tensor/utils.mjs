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
