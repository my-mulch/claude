import { removeSpaces } from './utils'
import { PARSE_NUMBER_REGEX, NUMERIC_SYMBOLS } from '../resources'

export default class DataType {
    constructor({ algebra, array }) {
        this.array = array
        this.algebra = algebra
        this.size = this.algebra.dimensions
    }

    parseNumber(number) {
        return String(number)
            .match(PARSE_NUMBER_REGEX)
            .map(removeSpaces)
            .map(Number)
    }

    stringNumber({ index, data }) {
        let string = ''

        for (let i = 0; i < this.size; i++) {
            const number = data[index + i]
            const sign = Math.sign(number) < 0 ? '-' : '+'

            if (i === 0 && sign === '+') {
                string += data[index]
                continue
            }
            
            string += `${sign}${data[index]}${NUMERIC_SYMBOLS[i]}`
        }

        return string
    }
}
