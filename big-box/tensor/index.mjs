import util from 'util' // node's utils

import {
    isTypedArray, // init utils
    parseNumber, stringNumber, // io utils
    shapeRaw,  // shape utils
} from './utils'

import {
    __Math__, ARRAY_SPACER_REGEX, ARRAY_REPLACER_REGEX
} from '../resources'

import Header from '../header'
import Operations from '../operations'

export default class Tensor {
    constructor({ header, init = function () {
        return new this.type.array(this.size * this.type.size)
    } }) {
        for (const field in header)
            this[field] = header[field]

        this.header = header
        this.data = init.call(this)
    }

    static min(A, B, R, meta) { return Operations.invoke(A, B, R, meta, Tensor.min.name) }
    static mean(A, B, R, meta) { return Operations.invoke(A, B, R, meta, Tensor.mean.name) }
    static cross(A, B, R, meta) { return Operations.invoke(A, B, R, meta, Tensor.cross.name) }
    static matMult(A, B, R, meta) { return Operations.invoke(A, B, R, meta, Tensor.matMult.name) }
    static inverse(A, B, R, meta) { return Operations.invoke(A, B, R, meta, Tensor.inverse.name) }

    static tensor(array, type) {
        return new Tensor({
            header: new Header({
                type,
                shape: shapeRaw(array),
            }),
            init: function () {
                if (isTypedArray(array))
                    return array

                const data = new this.type.array(this.size * this.type.size)

                data.set([array]
                    .flat(Number.POSITIVE_INFINITY)
                    .map(parseNumber)
                    .flat())

                return data
            }
        })
    }

    static zerosLike(tensor) {
        return new Tensor({
            header: new Header({
                shape: tensor.shape,
                type: tensor.type,
            })
        })
    }

    static zeros(shape, type) {
        return new Tensor({ header: new Header({ shape, type }) })
    }

    static ones(shape, type) {
        return new Tensor({
            header: new Header({ shape, type }),
            init: function () {
                return new this.type.array(this.size * this.type.size).fill(1)
            }
        })
    }

    static arange(start, step, stop, type) {
        return new Tensor({
            header: new Header({
                type,
                shape: [__Math__.round((stop - start) / step)],
            }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)
                for (let i = start, j = 0; i < stop; i += step, j++) data[j] = i
                return data
            }
        })
    }

    static linspace(start, stop, num, type) {
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


    static rand(shape, type) {
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

    static randrange(low, high, shape, type) {
        return new Tensor({
            header: new Header({ shape, type }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)

                for (let i = 0; i < data.length; i++)
                    data[i] = Operations.invoke({ low, high, method: Tensor.randrange.name })

                return data
            }
        })
    }

    static eye(shape, type) {
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

    astype(type, old = this) {
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
        return Tensor
            .array({ with: this.toRaw() })
            .reshape({ shape: [-1] })
    }

    slice(region, old = this) {
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

    reshape(shape, old = this) {
        if (!this.contig)
            return Tensor.array(this.toRaw(), this.type).reshape({ shape })

        return new Tensor({
            header: this.header.reshape(shape),
            init: function () { return old.data }
        })
    }

    toRaw(index = this.offset, depth = 0) {
        if (!this.shape.length || depth === this.shape.length)
            return stringNumber({ index, array: this })

        return [...new Array(this.shape[depth]).keys()].map(function (i) {
            return this.toRaw(i * this.strides[depth] + index, depth + 1)
        }, this)
    }

    valueOf() { return this.data[this.offset] }

    toString() {
        return JSON
            .stringify(this.toRaw())
            .replace(ARRAY_SPACER_REGEX, ARRAY_REPLACER_REGEX)
    }

    [util.inspect.custom]() { return this.toString() }
}

/** Init data types */
for (const [size, prefix] of [[1, ''], [2, 'Complex'], [4, 'Quat']]) {
    Tensor[prefix + 'Uint8Clamped'] = { size, array: Uint8ClampedArray }
    Tensor[prefix + 'Uint8'] = { size, array: Uint8Array }
    Tensor[prefix + 'Uint16'] = { size, array: Uint16Array }
    Tensor[prefix + 'Uint32'] = { size, array: Uint32Array }
    Tensor[prefix + 'Int8'] = { size, array: Int8Array }
    Tensor[prefix + 'Int16'] = { size, array: Int16Array }
    Tensor[prefix + 'Int32'] = { size, array: Int32Array }
    Tensor[prefix + 'Float32'] = { size, array: Float32Array }
}

/** Init null tensor */
Tensor.NULL = { id: '' }

