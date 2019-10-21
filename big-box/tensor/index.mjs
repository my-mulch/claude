import util from 'util'
import Header from '../header'

import { isTypedArray, parseNumber, stringNumber, shapeRaw, } from './utils'
import { __Math__, ARRAY_SPACER_REGEX, ARRAY_REPLACER_REGEX } from '../resources'

export default class Tensor {
    constructor({ header, init = function () {
        return new this.type.array(this.size * this.type.size)
    } }) {
        for (const field in header)
            this[field] = header[field]

        this.header = header
        this.data = init.call(this)
    }

    static tensor({ tensor, type }) {
        return new Tensor({
            header: new Header({ type, shape: shapeRaw(tensor) }),
            init: function () {
                if (isTypedArray(tensor))
                    return tensor

                const data = new this.type.array(this.size * this.type.size)
                data.set([tensor].flat(Number.POSITIVE_INFINITY).map(parseNumber).flat())

                return data
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

    static arange({ start, step, stop, type }) {
        return new Tensor({
            header: new Header({ type, shape: [__Math__.round((stop - start) / step)] }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)
                for (let i = start, j = 0; i < stop; i += step, j++) data[j] = i
                return data
            }
        })
    }

    static linspace({ start, stop, num, type }) {
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
        return Tensor.tensor(this.toRaw(), this.type).reshape([-1])
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
