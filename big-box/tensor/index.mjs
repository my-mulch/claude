import Types from '../types/index.mjs'
import Header from '../header/index.mjs'

import { __Math__, SYMBOL_FROM_ID, ARRAY_SPACER, ARRAY_REPLACER, PRECISION } from '../resources/index.mjs'

export default class Tensor {
    constructor({ header, data }) {
        this.header = header
        this.data = this.header.type.array(data || this.header.size)
    }

    static intersection(a1, a2) {
        if (a1.constructor === Tensor && a2.constructor === Tensor) {
            a1 = a1.toRawFlat()
            a2 = a2.toRawFlat()
        }

        return a1.filter(function (value) { return a2.includes(value) })
    }

    static difference(a1, a2) {
        if (a1.constructor === Tensor && a2.constructor === Tensor) {
            a1 = a1.toRawFlat()
            a2 = a2.toRawFlat()
        }

        return a1.filter(function (value) { return !a2.includes(value) })
    }

    static shape(array) {
        if (array.constructor === Tensor)
            return array.shape

        if (Types.isTypedArray(array))
            return [array.length]

        const shape = []

        while (array.constructor === Array) {
            shape.push(array.length)
            array = array[0]
        }

        return shape
    }

    static tensor({ data, type }) {
        if (data === undefined)
            return Tensor.zeros()

        if (data.constructor === Tensor)
            return data

        const shape = Tensor.shape(data)

        if (data.constructor === String ||
            data.constructor === Number ||
            data.constructor === Array)
            data = [data].flat(Number.POSITIVE_INFINITY)

        type = type || Types.resolve(data[0])

        return new Tensor({ data, header: new Header({ type, shape }) })
    }

    static zerosLike({ tensor }) {
        return new Tensor({
            header: new Header({
                shape: tensor.header.shape,
                type: tensor.header.type
            })
        })
    }

    static zeros({ shape, type } = {}) {
        return new Tensor({ header: new Header({ shape, type }) })
    }

    static onesLike({ tensor }) {
        tensor = new Tensor({
            header: new Header({
                shape: tensor.header.shape,
                type: tensor.header.type
            })
        })

        tensor.data.fill(1)

        return tensor
    }

    static ones({ shape, type }) {
        const tensor = new Tensor({ header: new Header({ shape, type }) })
        tensor.data.fill(1)

        return tensor
    }

    static arange({ start = 0, step = 1, stop, type }) {
        const shape = [__Math__.round((stop - start) / step)]
        const tensor = new Tensor({ header: new Header({ type, shape }) })

        for (let i = start, j = 0; i < stop; i += step, j++)
            tensor.data[j] = i

        return tensor
    }

    static linspace({ start, stop, num = 50, type }) {
        const step = (stop - start) / (num - 1)
        const tensor = new Tensor({ header: new Header({ type, shape: [num] }) })

        for (let i = start, j = 0; i <= stop; i += step, j += tensor.header.type.size)
            tensor.data[j] = i

        return tensor
    }

    static rand({ shape, type }) {
        const tensor = new Tensor({ header: new Header({ shape, type }) })

        for (let i = 0; i < tensor.data.length; i++)
            tensor.data[i] = __Math__.random()

        return tensor
    }

    static randrange({ low, high, shape, type }) {
        const tensor = new Tensor({ header: new Header({ shape, type }) })

        for (let i = 0; i < tensor.data.length; i++)
            tensor.data[i] = low + __Math__.floor(__Math__.random() * (high - low))

        return tensor
    }

    static eye({ shape, type }) {
        const tensor = new Tensor({ header: new Header({ shape, type }) })
        const diagonal = tensor.header.strides.reduce(__Math__.add)
        const numDiags = __Math__.min(...tensor.header.shape)

        for (let i = 0; i < numDiags * diagonal; i += diagonal)
            tensor.data[i] = 1

        return tensor
    }

    astype({ type }) {
        if (type === this.header.type)
            return this

        if (this.header.size === 1)
            return this

        const raw = this.toRaw().flat(Number.POSITIVE_INFINITY)
        const data = type.array(this.header.size)

        for (let i = 0, j = 0; i < raw.length; i++ , j += type.size)
            for (let o = 0, parsed = Types.parse(raw[i]); o < __Math__.min(type.size, this.header.type.size); o++)
                data[j + o] = parsed[o]

        return new Tensor({ header: new Header({ type, shape: this.header.shape }), data })
    }

    view({ type }) {
        if (type === this.header.type)
            return this

        if (!this.header.contig)
            return this

        const ratio = this.header.type.size / type.size

        this.header.size *= ratio
        this.header.type = type
        this.header.shape[this.header.shape.length - 1] *= ratio
        this.header.strides[this.header.strides.length - 1] /= ratio

        return this
    }

    copy() { return new Tensor({ header: this.header, data: this.data.slice() }) }
    ravel() { return Tensor.tensor({ data: this.toRaw(), type: this.header.type }).reshape({ shape: [-1] }) }
    slice({ region }) { return new Tensor({ header: this.header.slice(region), data: this.data }) }
    T() { return new Tensor({ header: this.header.transpose(), data: this.data }) }

    reshape({ shape }) {
        if (!this.header.contig)
            return Tensor.tensor({ data: this.toRaw(), type: this.header.type }).reshape({ shape })

        return new Tensor({ header: this.header.reshape(shape), data: this.data })
    }

    visit(operation = this.toStringAtIndex.bind(this), index = this.header.offset, depth = 0) {
        if (!this.header.shape.length || depth === this.header.shape.length)
            return operation(index)

        return [...new Array(this.header.shape[depth]).keys()].map(function (i) {
            return this.visit(operation, i * this.header.strides[depth] + index, depth + 1)
        }, this)
    }

    toRaw() {
        return this.visit()
    }

    toRawFlat() {
        return this.visit().flat(Number.POSITIVE_INFINITY)
    }

    toIndices() {
        const indices = []

        this.visit(function (index) { indices.push(index) })

        return indices
    }

    toStringAtIndex(index, string = '') {
        for (let i = 0; i < this.header.type.size; i++) {
            const sign = __Math__.sign(this.data[index + i]) < 0 ? '-' : '+'
            const number = __Math__.abs(this.data[index + i])

            if (number)
                string += `${sign}${number.toPrecision()}${SYMBOL_FROM_ID[i]}`
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
}
