import util from 'util'
import Type from '../type'
import Header from '../header'

import {
    __Math__, PARSE_NUMBER, ID_FROM_SYMBOL,
    SYMBOL_FROM_ID, ARRAY_SPACER, ARRAY_REPLACER, SPACE
} from '../resources'

export default class Tensor {
    constructor({ header, init = function () {
        return new this.type.array(this.size * this.type.size)
    } }) {
        for (const field in header)
            this[field] = header[field]

        this.header = header
        this.data = init.call(this)
    }

    static isTypedArray(array) {
        if (array.constructor === Tensor)
            return true

        return array.constructor === Float32Array
            || array.constructor === Int8Array
            || array.constructor === Int16Array
            || array.constructor === Int32Array
            || array.constructor === Uint8Array
            || array.constructor === Uint16Array
            || array.constructor === Uint32Array
            || array.constructor === Uint8ClampedArray
    }

    static shape(array, shape = []) {
        if (array.constructor === Tensor)
            return array.shape

        if (array.constructor !== Array)
            return shape

        return Tensor.shape(array[0], shape.concat(array.length))
    }

    static fillEmpties(array) {
        return Array.from(array, function (value) { return value || 0 })
    }

    static tensor({ data, type = Tensor.Float32 }) {
        return new Tensor({
            header: new Header({ type, shape: Tensor.shape(data) }),
            init: function () {
                if (Tensor.isTypedArray(data))
                    return data

                return new this.type.array([data]
                    .flat(Number.POSITIVE_INFINITY)
                    .flatMap(function (number) {
                        const result = Tensor.parseNumber(number)

                        if (result.length > this.type.size)
                            this.type = Type.resolve(result.length)

                        result.length = this.type.size

                        return Tensor.fillEmpties(result)
                    }, this))
            }
        })
    }

    static zerosLike({ tensor }) {
        return new Tensor({ header: new Header({ shape: tensor.shape, type: tensor.type }) })
    }

    static zeros({ shape, type = Tensor.Float32 }) {
        return new Tensor({ header: new Header({ shape, type }) })
    }

    static onesLike({ tensor }) {
        return new Tensor({
            header: new Header({ shape: tensor.shape, type: tensor.type }),
            init: function () { return new this.type.array(this.size * this.type.size).fill(1) }
        })
    }

    static ones({ shape, type = Tensor.Float32 }) {
        return new Tensor({
            header: new Header({ shape, type }),
            init: function () { return new this.type.array(this.size * this.type.size).fill(1) }
        })
    }

    static arange({ start = 0, step = 1, stop, type = Tensor.Float32 }) {
        return new Tensor({
            header: new Header({ type, shape: [__Math__.round((stop - start) / step)] }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)
                for (let i = start, j = 0; i < stop; i += step, j++) data[j] = i
                return data
            }
        })
    }

    static linspace({ start, stop, num = 50, type = Tensor.Float32 }) {
        const step = (stop - start) / num
        return new Tensor({
            header: new Header({ type, shape: [num] }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)
                for (let i = start, j = 0; i < stop; i += step, j++) data[j] = i
                return data
            }
        })
    }


    static rand({ shape, type = Tensor.Float32 }) {
        return new Tensor({
            header: new Header({ shape, type }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)

                for (let i = 0; i < data.length; i++)
                    data[i] = __Math__.random() - 1

                return data
            }
        })
    }

    static randrange({ low, high, shape, type = Tensor.Float32 }) {
        return new Tensor({
            header: new Header({ shape, type }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)

                for (let i = 0; i < data.length; i++)
                    data[i] = low + __Math__.floor(__Math__.random() * (high - low))

                return data
            }
        })
    }

    static eye({ shape, type = Tensor.Float32 }) {
        return new Tensor({
            header: new Header({ shape, type }),
            init: function () {
                const data = new this.type.array(this.size)
                const diagonal = this.strides.reduce(__Math__.add)
                const numDiags = __Math__.min(...this.shape)

                for (let i = 0; i < numDiags * diagonal; i += diagonal)
                    data[i] = 1

                return data
            }
        })
    }

    astype({ type }, old = this) {
        let shape = old.shape.slice()

        if (type.size > 1 && old.type.size === 1)
            shape[shape.length - 1] /= type.size

        return new Tensor({
            header: new Header({
                type,
                shape,
                offset: this.offset,
                contig: this.contig,
            }),
            init: function () { return new this.type.array(old.data) }
        })
    }

    copy(old = this) {
        return new Tensor({
            header: this.header,
            init: function () { return old.data.slice() }
        })
    }

    ravel() {
        return Tensor.tensor({ data: this.toRaw(), type: this.type }).reshape({ shape: [-1] })
    }

    slice({ region }, old = this) {
        return new Tensor({
            header: this.header.slice(region),
            init: function () { return old.data }
        })
    }

    T(old = this) {
        return new Tensor({
            header: this.header.transpose(),
            init: function () { return old.data }
        })
    }

    reshape({ shape }, old = this) {
        if (!this.contig)
            return Tensor.tensor({ data: this.toRaw(), type: this.type }).reshape({ shape })

        return new Tensor({
            header: this.header.reshape(shape),
            init: function () { return old.data }
        })
    }

    toRaw(index = this.offset, depth = 0) {
        if (!this.shape.length || depth === this.shape.length)
            return this.toStringAtIndex(index)

        return [...new Array(this.shape[depth]).keys()].map(function (i) {
            return this.toRaw(i * this.strides[depth] + index, depth + 1)
        }, this)
    }

    valueOf() { return this.data[this.offset] }

    static parseNumber(number) {
        const result = []
        const tokens = String(number)
            .match(PARSE_NUMBER)
            .filter(function (token) {
                return !SPACE.test(token)
            })

        let sign = 1, token
        for (let i = 0; i < tokens.length; i++) {
            token = tokens[i]

            if (token in ID_FROM_SYMBOL) {
                if (isNaN(tokens[i - 1])) {
                    result[ID_FROM_SYMBOL[token]] = result[ID_FROM_SYMBOL[token]] || 0
                    result[ID_FROM_SYMBOL[token]] += sign
                }
            }

            else if (token === '+') sign = 1
            else if (token === '-') sign = -1

            else if (!isNaN(token)) {
                let symbol = tokens[i + 1]

                if (symbol in ID_FROM_SYMBOL) {
                    result[ID_FROM_SYMBOL[symbol]] = result[ID_FROM_SYMBOL[symbol]] || 0
                    result[ID_FROM_SYMBOL[symbol]] += sign * Number(token)
                }
                else {
                    result[0] = result[0] || 0
                    result[0] += sign * Number(token)
                }
            }
        }

        return Tensor.fillEmpties(result)
    }

    toStringAtIndex(index, string = '') {
        for (let i = 0; i < this.type.size; i++) {
            const sign = Math.sign(this.data[index + i]) < 0 ? '-' : '+'
            const number = Math.abs(this.data[index + i])

            if (number)
                string += `${sign}${number}${SYMBOL_FROM_ID[i]}`
        }

        if (!string) return "0"
        if (string.startsWith('+')) return string.slice(1)

        return string
    }

    toString() {
        return JSON
            .stringify(this.toRaw())
            .replace(ARRAY_SPACER, ARRAY_REPLACER)
    }

    [util.inspect.custom]() { return this.toString() }
}
