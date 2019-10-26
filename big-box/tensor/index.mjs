import util from 'util'
import Header from '../header'

import {
    __Math__, PARSE_NUMBER, NUMBER_FROM_SYMBOL,
    SYMBOL_FROM_NUMBER, ARRAY_SPACER, ARRAY_REPLACER, SPACE
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

    static isTypedArray(tensor) {
        if (tensor.constructor === Tensor)
            return true

        return tensor.constructor === Float32Array
            || tensor.constructor === Int8Array
            || tensor.constructor === Int16Array
            || tensor.constructor === Int32Array
            || tensor.constructor === Uint8Array
            || tensor.constructor === Uint16Array
            || tensor.constructor === Uint32Array
            || tensor.constructor === Uint8ClampedArray
    }

    static shape(tensor, shape = []) {
        if (tensor.constructor === Tensor)
            return tensor.shape

        if (tensor.constructor !== Array)
            return shape

        return Tensor.shape(tensor[0], shape.concat(tensor.length))
    }

    static tensor({ data, type }) {
        return new Tensor({
            header: new Header({ type, shape: Tensor.shape(data) }),
            init: function () {
                if (Tensor.isTypedArray(data))
                    return data

                const values = new this.type.array(this.size * this.type.size)
                values.set([data]
                    .flat(Number.POSITIVE_INFINITY)
                    .map(function (number) {
                        return Tensor.parseNumber(number, this.type.size)
                    }, this)
                    .flat())

                return values
            }
        })
    }

    static zerosLike({ tensor }) {
        return new Tensor({ header: new Header({ shape: tensor.shape, type: tensor.type }) })
    }

    static zeros({ shape, type }) {
        return new Tensor({ header: new Header({ shape, type }) })
    }

    static onesLike({ tensor }) {
        return new Tensor({
            header: new Header({ shape: tensor.shape, type: tensor.type }),
            init: function () { return new this.type.array(this.size * this.type.size).fill(1) }
        })
    }

    static ones({ shape, type }) {
        return new Tensor({
            header: new Header({ shape, type }),
            init: function () { return new this.type.array(this.size * this.type.size).fill(1) }
        })
    }

    static arange({ start = 0, step = 1, stop, type }) {
        return new Tensor({
            header: new Header({ type, shape: [__Math__.round((stop - start) / step)] }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)
                for (let i = start, j = 0; i < stop; i += step, j++) data[j] = i
                return data
            }
        })
    }

    static linspace({ start, stop, num = 50, type }) {
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


    static rand({ shape, type }) {
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

    static randrange({ low, high, shape, type }) {
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

    static eye({ shape, type }) {
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

    static parseNumber(number, size) {
        const result = new Array(size).fill(0)
        const tokens = String(number)
            .match(PARSE_NUMBER)
            .filter(function (token) { return !SPACE.test(token) })

        let sign = 1, token
        for (let i = 0; i < tokens.length; i++) {
            token = tokens[i]

            if (token in NUMBER_FROM_SYMBOL) {
                if (isNaN(tokens[i - 1])) {
                    result[NUMBER_FROM_SYMBOL[token]] = result[NUMBER_FROM_SYMBOL[token]] || 0
                    result[NUMBER_FROM_SYMBOL[token]] += sign
                }
            }

            else if (token === '+') sign = 1
            else if (token === '-') sign = -1

            else if (!isNaN(token)) {
                let symbol = tokens[i + 1]

                if (symbol in NUMBER_FROM_SYMBOL) {
                    result[NUMBER_FROM_SYMBOL[symbol]] = result[NUMBER_FROM_SYMBOL[symbol]] || 0
                    result[NUMBER_FROM_SYMBOL[symbol]] += sign * Number(token)
                }
                else {
                    result[0] = result[0] || 0
                    result[0] += sign * Number(token)
                }
            }
        }

        return result
    }

    toStringAtIndex(index) {
        let string = ''

        for (let i = 0; i < this.type.size; i++) {
            let number = this.data[index + i]
            const sign = Math.sign(number) < 0 ? '-' : '+'
            number = Math.abs(number)

            if (number === 0) continue

            if (i === 0) {
                string += `${sign === '-' ? sign : ''}${number}`
                continue
            }

            string += `${sign}${number}${SYMBOL_FROM_NUMBER[i]}`
        }

        if (string.startsWith('+'))
            return string.slice(1)

        if (!string)
            return "0"

        return string
    }

    toString() {
        return JSON
            .stringify(this.toRaw())
            .replace(ARRAY_SPACER, ARRAY_REPLACER)
    }

    [util.inspect.custom]() { return this.toString() }
}
