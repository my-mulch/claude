import Header from './header.mjs'

export default class Tensor {
    constructor(data, header) {
        this.data = data
        this.header = header
    }

    static config = {
        PRECISION: 2,
        ARRAY_REPLACER: '],\n$1[',
        ARRAY_SPACER: /\]\,(\s*)\[/g,
        SYMBOL_FROM_ID: { 0: '', 1: 'i', 2: 'j', 3: 'k' },
    }

    static Int8 = { size: 1, array: Int8Array }
    static Int16 = { size: 1, array: Int16Array }
    static Int32 = { size: 1, array: Int32Array }
    static Uint8 = { size: 1, array: Uint8Array }
    static Uint16 = { size: 1, array: Uint16Array }
    static Uint32 = { size: 1, array: Uint32Array }
    static Float32 = { size: 1, array: Float32Array }
    static Float64 = { size: 1, array: Float64Array }
    static Uint8Clamped = { size: 1, array: Uint8ClampedArray }

    static ComplexInt8 = { size: 2, array: Int8Array }
    static ComplexInt16 = { size: 2, array: Int16Array }
    static ComplexInt32 = { size: 2, array: Int32Array }
    static ComplexUint8 = { size: 2, array: Uint8Array }
    static ComplexUint16 = { size: 2, array: Uint16Array }
    static ComplexUint32 = { size: 2, array: Uint32Array }
    static ComplexFloat32 = { size: 2, array: Float32Array }
    static ComplexFloat64 = { size: 2, array: Float64Array }
    static ComplexUint8Clamped = { size: 2, array: Uint8ClampedArray }

    static QuatInt8 = { size: 4, array: Int8Array }
    static QuatInt16 = { size: 4, array: Int16Array }
    static QuatInt32 = { size: 4, array: Int32Array }
    static QuatUint8 = { size: 4, array: Uint8Array }
    static QuatUint16 = { size: 4, array: Uint16Array }
    static QuatUint32 = { size: 4, array: Uint32Array }
    static QuatFloat32 = { size: 4, array: Float32Array }
    static QuatFloat64 = { size: 4, array: Float64Array }
    static QuatUint8Clamped = { size: 4, array: Uint8ClampedArray }

    static parseRaw(data) {
        if (data === undefined)
            throw "Attempting to get shape of undefined"

        const shape = []

        while (data[0].constructor === Array)
            shape.push(data.length), data = data[0]

        if (data.length === 1) return [shape, Tensor.Float32]
        if (data.length === 2) return [shape, Tensor.ComplexFloat32]
        if (data.length === 4) return [shape, Tensor.QuatFloat32]

        throw "Your type is not Float, Complex, or Quaternion"
    }

    static flattenRaw(data, flat = [], fi = [0]) {
        if (data.constructor !== Array)
            return flat[fi[0]++] = data

        for (let i = 0; i < data.length; i++)
            Tensor.flattenRaw(data[i], flat, fi)

        return flat
    }

    static tensor(data) {
        if (data === undefined) throw "You must provide data to create a tensor"

        if (data.constructor === Tensor) return data

        if (data.constructor === Int8Array) return new Tensor(data, new Header(Tensor.Int8, [data.length]))
        if (data.constructor === Int16Array) return new Tensor(data, new Header(Tensor.Int16, [data.length]))
        if (data.constructor === Int32Array) return new Tensor(data, new Header(Tensor.Int32, [data.length]))
        if (data.constructor === Uint8Array) return new Tensor(data, new Header(Tensor.Uint8, [data.length]))
        if (data.constructor === Uint16Array) return new Tensor(data, new Header(Tensor.Uint16, [data.length]))
        if (data.constructor === Uint32Array) return new Tensor(data, new Header(Tensor.Uint32, [data.length]))
        if (data.constructor === Float32Array) return new Tensor(data, new Header(Tensor.Float32, [data.length]))
        if (data.constructor === Float64Array) return new Tensor(data, new Header(Tensor.Float64, [data.length]))
        if (data.constructor === Uint8ClampedArray) return new Tensor(data, new Header(Tensor.Uint8Clamped, [data.length]))

        if (data.constructor === Array) {
            const [shape, type] = Tensor.parseRaw(data)
            const count = shape.reduce(function (a, b) { return a * b }, 1)

            if (shape.length <= 1)
                return new Tensor(new type.array(data), new Header(type, shape))

            const flatData = Tensor.flattenRaw(data, new type.array(count * type.size))

            return new Tensor(flatData, new Header(type, shape))
        }

        throw `You cannot create a tensor from type: ${data.constructor}. Pass either raw or typed array`
    }

    static zeros(...shape) {
        if (shape === undefined)
            throw "Attempting to create tensor with undefined shape"

        const type = Tensor.Float32
        const count = shape.reduce(function (a, b) { return a * b }, 1)

        return new Tensor(new type.array(count * type.size), new Header(type, shape))
    }

    static ones(...shape) {
        if (shape === undefined)
            throw "Attempting to create tensor with undefined shape"

        const tensor = Tensor.zeros(...shape)

        tensor.data.fill(1)

        return tensor
    }

    static arange(start = 0, stop, step = 1) {
        if (stop === undefined)
            throw "You must specify when to stop the range"

        const shape = [Math.round((stop - start) / step)]
        const count = shape[0]
        const type = Tensor.Float32
        const data = new type.array(count * type.size)

        for (let i = start, j = 0; i < stop; i += step, j++)
            data[j] = i

        return new Tensor(data, new Header(type, shape))
    }

    static linspace(start, stop, num = 50) {
        if (start === undefined || stop === undefined)
            throw "You must specify start and stop"

        const count = num
        const shape = [num]
        const type = Tensor.Float32
        const step = (stop - start) / (num - 1)
        const data = new type.array(count * type.size)

        for (let i = start, j = 0; i <= stop; i += step, j++)
            data[j] = i

        return new Tensor(data, new Header(type, shape))
    }

    static rand(...shape) {
        if (shape === undefined)
            throw "Attempting to create tensor with undefined shape"

        const tensor = Tensor.zeros(...shape)

        for (let i = 0; i < tensor.data.length; i++)
            tensor.data[i] = Math.random()

        return tensor
    }

    static randrange(low, high, shape) {
        if (low === undefined || high === undefined)
            throw "You must specify start and stop"

        if (shape === undefined)
            throw "Attempting to create randrange tensor with undefined shape"

        const tensor = Tensor.zeros(...shape)

        for (let i = 0; i < tensor.data.length; i++)
            tensor.data[i] = low + Math.floor(Math.random() * (high - low))

        return tensor
    }

    static eye(...shape) {
        if (shape === undefined)
            throw "Attempting to create tensor with undefined shape"

        const tensor = Tensor.zeros(...shape)

        const diagonal = tensor.header.strides.reduce(function (a, b) { return a + b })
        const numDiags = Math.min(...tensor.header.shape)

        for (let i = 0; i < numDiags * diagonal; i += diagonal)
            tensor.data[i] = 1

        return tensor
    }

    astype(type) {
        if (type === undefined)
            throw "Attempting to convert tensor to undefined type"

        if (type.size === this.header.type.size)
            return this

        if (this.header.count === 1)
            return this

        const raw = this.toRawFlat()
        const data = new type.array(this.header.count * type.size)

        const minSize = Math.min(type.size, this.header.type.size)

        for (let i = 0, j = 0; i < raw.length; i += this.header.type.size, j += type.size)
            for (let offset = 0; offset < minSize; offset++)
                data[j + offset] = raw[i + offset]

        return new Tensor(data, new Header(type, this.header.shape))
    }

    view(type) {
        if (type === this.header.type)
            return this

        if (!this.header.contig)
            return this

        return new Tensor(this.data, this.header.view(type))
    }

    copy() {
        return new Tensor(this.data.slice(), this.header)
    }

    ravel() {
        return Tensor.tensor(this.toRaw(), this.header.type).reshape([-1])
    }

    slice(...region) {
        return new Tensor(this.data, this.header.slice(region))
    }

    T() {
        return new Tensor(this.data, this.header.transpose())
    }

    reshape(...shape) {
        if (!this.header.contig)
            return Tensor.tensor(this.toRawFlat(), this.header.type).reshape(...shape)

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
            const sign = Math.sign(this.data[index + i]) < 0 ? '-' : '+'
            const number = Math.abs(this.data[index + i])

            string += `${sign}${number.toFixed(Tensor.config.PRECISION)}${Tensor.config.SYMBOL_FROM_ID[i]}`
        }

        if (!string)
            return '0'

        if (string.startsWith('+'))
            return string.slice(1)

        return string
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

    toPretty() {
        return this.visit(this.toStringAtIndex.bind(this))
    }

    toString() {
        return JSON
            .stringify(this.toPretty())
            .replace(Tensor.config.ARRAY_SPACER, Tensor.config.ARRAY_REPLACER)
    }
}
