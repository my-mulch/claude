import Header from '../header/index.mjs'

import { __Math__, PRECISION, SYMBOL_FROM_ID } from '../resources/index.mjs'

export default class Tensor {
    constructor(data, header) {
        this.data = data
        this.header = header
    }

    static shape(data) {
        if (data === undefined)
            throw "Attempting to get shape of something undefined"

        const shape = []

        while (data[0].constructor === Array)
            shape.push(data.length), data = data[0]
        
        return shape
    }

    static flatten(data, flat = [], fi = [0]) {
        if (data.constructor !== Array)
            return flat[fi[0]++] = data

        for (let i = 0; i < data.length; i++)
            Tensor.flatten(data[i], flat, fi)

        return flat
    }

    static isTyped(data) {
        if (data === undefined)
            throw "Attempting to check type of something undefined"

        return data.constructor === Int8Array
            || data.constructor === Int16Array
            || data.constructor === Int32Array
            || data.constructor === Uint8Array
            || data.constructor === Uint16Array
            || data.constructor === Uint32Array
            || data.constructor === Float32Array
            || data.constructor === Float64Array
            || data.constructor === Uint8ClampedArray
    }

    static tensor(data, type = Tensor.Float32) {
        if (data === undefined)
            throw "Attempting to create tensor from undefined"

        if (data.constructor === Tensor)
            return data

        if (Tensor.isTyped(data))
            return new Tensor(data, new Header({ shape: [data.length], type }))

        /** Tensor dimensions */
        const shape = Tensor.shape(data)
        const size = shape.reduce(__Math__.multiply, 1)

        /** Flatten data */
        const array = Tensor.flatten(data, new type.array(size * type.size))

        return new Tensor(array, new Header({ type, shape, size }))
    }

    static zerosLike(tensor) {
        if (tensor === undefined)
            throw "Attempting to create tensor from undefined"

        return new Tensor(
            new tensor.type.array(tensor.header.size * tensor.header.type.size),
            new Header({ shape: tensor.header.shape, type: tensor.header.type }))
    }

    static zeros(shape, type = Tensor.Float32) {
        if (shape === undefined)
            throw "Attempting to create tensor with undefined shape"

        const size = shape.reduce(__Math__.multiply, 1)

        return new Tensor(
            new type.array(size * type.size),
            new Header({ shape, size, type }))
    }

    static onesLike(tensor) {
        if (tensor === undefined)
            throw "Attempting to create tensor from undefined"

        const ones = new Tensor(
            new tensor.type.array(tensor.header.size * tensor.header.type.size),
            new Header({ shape: tensor.header.shape, type: tensor.header.type }))

        ones.data.fill(1)

        return ones
    }

    static ones(shape, type = Tensor.Float32) {
        if (shape === undefined)
            throw "Attempting to create tensor with undefined shape"

        const size = shape.reduce(__Math__.multiply, 1)

        const ones = new Tensor(
            new type.array(size * type.size),
            new Header({ shape, size, type }))

        ones.data.fill(1)

        return ones
    }

    static arange(start = 0, step = 1, stop, type = Tensor.Float32) {
        if (stop === undefined)
            throw "You must specify when to stop the range"

        const shape = [__Math__.round((stop - start) / step)]
        const size = shape.reduce(__Math__.multiply, 1)

        const tensor = new Tensor(
            new type.array(size * type.size),
            new Header({ type, shape, size }))

        for (let i = start, j = 0; i < stop; i += step, j++)
            tensor.data[j] = i

        return tensor
    }

    static linspace(start, stop, num = 50, type = Tensor.Float32) {
        if (start === undefined || stop === undefined)
            throw "You must specify start and stop"

        const step = (stop - start) / (num - 1)
        const shape = [num]
        const size = num

        const tensor = new Tensor(
            new type.array(size * type.size),
            new Header({ type, shape, size }))

        for (let i = start, j = 0; i <= stop; i += step, j += tensor.header.type.size)
            tensor.data[j] = i

        return tensor
    }

    static rand(shape, type = Tensor.Float32) {
        if (shape === undefined)
            throw "Attempting to create tensor with undefined shape"

        const size = shape.reduce(__Math__.multiply, 1)

        const tensor = new Tensor(
            new type.array(size * type.size),
            new Header({ shape, type, size }))

        for (let i = 0; i < tensor.data.length; i++)
            tensor.data[i] = __Math__.random()

        return tensor
    }

    static randrange(low, high, shape, type = Tensor.Float32) {
        if (low === undefined || high === undefined)
            throw "You must specify start and stop"

        if (shape === undefined)
            throw "Attempting to create tensor with undefined shape"

        const size = shape.reduce(__Math__.multiply, 1)

        const tensor = new Tensor(
            new type.array(size * type.size),
            new Header({ shape, type, size }))

        for (let i = 0; i < tensor.data.length; i++)
            tensor.data[i] = low + __Math__.floor(__Math__.random() * (high - low))

        return tensor
    }

    static eye(shape, type = Tensor.Float32) {
        if (shape === undefined)
            throw "Attempting to create tensor with undefined shape"

        const size = shape.reduce(__Math__.multiply, 1)

        const tensor = new Tensor(
            new type.array(size * type.size),
            new Header({ shape, size, type }))

        const diagonal = tensor.header.strides.reduce(__Math__.add)
        const numDiags = __Math__.min(...tensor.header.shape)

        for (let i = 0; i < numDiags * diagonal; i += diagonal)
            tensor.data[i] = 1

        return tensor
    }

    astype(type) {
        if (type === undefined)
            throw "Attempting to convert tensor to undefined type"

        if (type === this.header.type)
            return this

        if (this.header.size === 1)
            return this

        const raw = this.toRawFlat()
        const data = new type.array(this.header.size * type.size)

        for (let i = 0, j = 0; i < raw.length; i += this.header.type.size, j += type.size)
            for (let offset = 0; offset < __Math__.min(type.size, this.header.type.size); offset++)
                data[j + offset] = raw[i + offset]

        return new Tensor(data, new Header({ type, shape: this.header.shape }))
    }

    view(type) {
        if (type === undefined)
            throw "Attempting to view tensor as undefined type"

        if (type === this.header.type)
            return this

        if (!this.header.isContig)
            return this

        const ratio = this.header.type.size / type.size

        this.header.size *= ratio
        this.header.type = type
        this.header.shape[this.header.shape.length - 1] *= ratio
        this.header.strides[this.header.strides.length - 1] /= ratio

        return this
    }

    copy() {
        return new Tensor(this.data.slice(), this.header)
    }

    ravel() {
        return Tensor.tensor(this.toRaw(), this.header.type).reshape([-1])
    }

    slice(region) {
        if (region === undefined)
            throw 'You must specify a region to slice'

        return new Tensor(this.data, this.header.slice(region))
    }

    T() {
        return new Tensor(this.data, this.header.transpose())
    }

    reshape(shape) {
        if (shape === undefined)
            throw 'You must specify reshape dimensions'

        if (!this.header.isContig)
            return Tensor.tensor(this.toRaw(), this.header.type).reshape(shape)

        return new Tensor(this.data, this.header.reshape(shape))
    }

    visit(operation, index = this.header.offset, depth = 0) {
        if (!this.header.shape.length || depth === this.header.shape.length)
            return operation(index)

        return [...new Array(this.header.shape[depth]).keys()].map(function (i) {
            return this.visit(operation, i * this.header.strides[depth] + index, depth + 1)
        }, this)
    }

    toStringAtIndex(index, string = '') {
        for (let i = 0; i < this.header.type.size; i++) {
            const sign = __Math__.sign(this.data[index + i]) < 0 ? '-' : '+'
            const number = __Math__.abs(this.data[index + i])

            string += `${sign}${number.toPrecision(PRECISION)}${SYMBOL_FROM_ID[i]}`
        }

        if (!string)
            return '0'

        if (string.startsWith('+'))
            return string.slice(1)

        return string
    }

    toString() {
        return this.visit(this.toStringAtIndex.bind(this))
    }

    toRawAtIndex(index) {
        const result = []

        for (let i = 0; i < this.header.type.size; i++)
            result.push(this.data[index + i])

        return result
    }

    toRaw() {
        return this.visit(this.toRawAtIndex.bind(this))
    }

    toRawFlat() {
        return this.toRaw().flat(Number.POSITIVE_INFINITY)
    }

    toIndices() {
        const indices = []

        this.visit(function (index) { indices.push(index) })

        return indices
    }

    valueOf() {
        return this.toRaw()
    }
}
