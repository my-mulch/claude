import { PARSE_NUMBER_REGEX, REMOVE_SPACES } from '../resources'

export default class DataType {
    constructor({ algebra, array }) {
        this.array = array
        this.algebra = algebra
        this.size = this.algebra.dimensions
    }

    dataOut({ i, data }) {
        
    }

    dataIn({ value, index, destination }) {
        value = String(value)
            .match(PARSE_NUMBER_REGEX)
            .map(REMOVE_SPACES)
            .map(Number)

        for (let i = 0; i < this.value.length; i++)
            destination[index + i] = value[i]
    }
}
