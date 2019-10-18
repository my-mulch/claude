import { __Math__, PARSE_NUMBER_REGEX, NUMERIC_SYMBOLS, SPACE_REGEX } from '../resources'

export const isTypedArray = function (array) {
    return array.constructor === Float32Array
        || array.constructor === Int8Array
        || array.constructor === Int16Array
        || array.constructor === Int32Array
        || array.constructor === Uint8Array
        || array.constructor === Uint16Array
        || array.constructor === Uint32Array
        || array.constructor === Uint8ClampedArray
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


export const shapeRaw = function (rawArray, shape = []) {
    if (rawArray.constructor !== Array)
        return shape

    return shapeRaw(rawArray[0], shape.concat(rawArray.length))
}
