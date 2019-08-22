import util from 'util' // node's utils

import {
    shapeRaw, shapeAlign, // shape utils
    selfAxesAndShape, pairAxesAndShape, // operation utils
} from './utils'

import Types from './types'
import Header from './header'
import Operations from './operations'

import { __Math__, ARRAY_SPACER, ARRAY_REPLACER } from '../resources/big-box'

export default class BigBox {
    constructor({ header, init = function () {
        return new this.type.array(this.size * this.type.size)
    } }) {

        for (const field in header)
            this[field] = header[field]

        this.header = header
        this.data = init.call(this)
    }

    static array(args) {
        return new BigBox({
            header: new Header({
                shape: shapeRaw(args.with),
                type: args.type,
            }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)
                const rawArray = args.with.constructor === Array && args.with.flat(Number.POSITIVE_INFINITY)

                for (let i = 0, j = 0; i < data.length; i += this.type.size, j++)
                    switch (args.with.constructor) {
                        case Array: this.type.strIn({ num: rawArray[j], o: i, data }); break
                        case String: this.type.strIn({ num: args.with, o: i, data }); break
                        case Number: this.type.strIn({ num: args.with, o: i, data }); break
                        default: return args.with
                    }

                return data
            }
        })
    }

    static zeros(args) {
        return new BigBox({
            header: new Header({
                shape: args.shape,
                type: args.type,
            })
        })
    }

    static ones(args) {
        return new BigBox({
            header: new Header({
                shape: args.shape,
                type: args.type,
            }),
            init: function () {
                return new this.type.array(this.size * this.type.size).fill(1)
            }
        })
    }

    static arange(args) {
        const stop = args.stop
        const step = args.step || 1
        const start = args.start || 0

        return new BigBox({
            header: new Header({
                shape: [__Math__.round((stop - start) / step)],
                type: args.type,
            }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)
                for (let i = start, j = 0; i < stop; i += step, j++) data[j] = i
                return data
            }
        })
    }

    static linspace(args) {
        const num = args.num || 50
        const stop = args.stop
        const start = args.start
        const step = (stop - start) / num

        return new BigBox({
            header: new Header({
                shape: [num],
                type: args.type,
            }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)
                for (let i = start, j = 0; i < stop; i += step, j++) data[j] = i
                return data
            }
        })
    }


    static rand(args) {
        return new BigBox({
            header: new Header({
                shape: args.shape,
                type: args.type,
            }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)

                for (let i = 0; i < data.length; i++)
                    data[i] = __Math__.random() - 1

                return data
            }
        })
    }

    static randrange(args) {
        const low = args.low || 0
        const high = args.high

        return new BigBox({
            header: new Header({
                shape: args.shape,
                type: args.type,
            }),
            init: function () {
                const data = new this.type.array(this.size * this.type.size)

                for (let i = 0; i < data.length; i++)
                    data[i] = Operations.utils.randrange({ low, high })

                return data
            }
        })
    }

    static eye(args) {
        return new BigBox({
            header: new Header({
                shape: args.shape,
                type: args.type,
            }),
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

    sanitize(args) {
        if (args.with.constructor === Array ||
            args.with.constructor === String ||
            args.with.constructor === Number)

            args.with = BigBox.array({ with: args.with })
    }

    astype(args, old = this) {
        let shape = old.shape.slice()

        if (args.type.size > 1 && old.type.size === 1)
            shape[shape.length - 1] /= args.type.size

        return new BigBox({
            header: new Header({
                shape: shape,
                offset: this.offset,
                contig: this.contig,
                type: args.type,
            }),
            init: function () { return new this.type.array(old.data) }
        })
    }

    copy(old = this) {
        return new BigBox({
            header: this.header,
            init: function () { return old.data.slice() }
        })
    }

    ravel() {
        return BigBox
            .array({ with: this.toRaw() })
            .reshape({ shape: [-1] })
    }

    gpair(args, method) {
        this.sanitize(args)

        if (args.with.shape)
            args.with = shapeAlign({
                short: args.with,
                delta: this.shape.length - args.with.shape.length
            })

        const meta = pairAxesAndShape.call(this, args)

        return Operations.call({
            of: this,
            with: args.with,
            result: args.result || new BigBox({
                header: new Header({
                    type: this.type,
                    shape: meta.fullShape
                })
            }),
            meta: { method, ...meta }
        })
    }

    gself(args, method) {
        const meta = selfAxesAndShape.call(this, args)

        return Operations
            .call({
                of: this,
                with: { id: '' },
                result: args.result || new BigBox({
                    header: new Header({
                        type: this.type,
                        shape: meta.alignedShape
                    })
                }),
                meta: { method, ...meta }
            })
            .reshape({ shape: meta.resultShape })
    }

    exp() { return this.gpair({ with: { id: '' } }, this.exp.name) }
    sin() { return this.gpair({ with: { id: '' } }, this.sin.name) }
    cos() { return this.gpair({ with: { id: '' } }, this.cos.name) }

    add(args) { return this.gpair(args, this.add.name) }
    divide(args) { return this.gpair(args, this.divide.name) }
    subtract(args) { return this.gpair(args, this.subtract.name) }
    multiply(args) { return this.gpair(args, this.multiply.name) }

    sum(args = {}) { return this.gself(args, this.sum.name) }
    min(args = {}) { return this.gself(args, this.min.name) }
    max(args = {}) { return this.gself(args, this.max.name) }
    norm(args = {}) { return this.gself(args, this.norm.name) }
    mean(args = {}) { return this.gself(args, this.mean.name) }

    matMult(args) {
        this.sanitize(args)

        return Operations.call({
            of: this,
            with: args.with,
            result: args.result || new BigBox({
                header: new Header({
                    type: this.type,
                    shape: [this.shape[0], args.with.shape[1]]
                })
            }),
            meta: { method: this.matMult.name }
        })
    }

    cross(args) {
        this.sanitize(args)

        return Operations.call({
            of: this,
            with: args.with,
            result: args.result || new BigBox({
                header: new Header({
                    type: this.type,
                    shape: [3, 1]
                })
            }),
            meta: { method: this.cross.name }
        })
    }

    inverse(args = {}) {
        return Operations.call({
            of: this,
            with: { id: '' },
            result: args.result({ shape: this.shape }),
            meta: { method: this.inverse.name }
        })
    }

    assign(args) {
        this.sanitize(args)

        const region = args.region
            ? this.slice({ with: args.region })
            : this

        Operations.call({
            of: region,
            with: args.with,
            result: region,
            meta: {
                axesSize: region.size,
                fullSize: region.size,
                axesShape: [...region.shape.keys()],
                fullShape: region.shape,
                method: region.assign.name
            }
        })

        return this
    }

    slice(args, old = this) {
        return new BigBox({
            header: this.header.slice(args.with),
            init: function () { return old.data }
        })
    }

    T(old = this) {
        return new BigBox({
            header: this.header.transpose(),
            init: function () { return old.data }
        })
    }

    reshape(args, old = this) {
        if (!this.contig)
            return BigBox
                .array({ with: this.toRaw() })
                .reshape({ shape: args.shape })

        return new BigBox({
            header: this.header.reshape(args.shape),
            init: function () { return old.data }
        })
    }

    toRaw(index = this.offset, depth = 0) {
        if (!this.shape.length || depth === this.shape.length)
            return this.type.strOut({ o: index, data: this.data })

        return [...new Array(this.shape[depth]).keys()].map(function (i) {
            return this.toRaw(i * this.strides[depth] + index, depth + 1)
        }, this)
    }

    valueOf() { return this.data[this.offset] }

    toString() {
        return JSON
            .stringify(this.toRaw())
            .replace(ARRAY_SPACER, ARRAY_REPLACER)
    }

    [util.inspect.custom]() { return this.toString() }
}

/** Quaternion types */
BigBox.QuatUint8Clamped = Types.Quaternion(Uint8ClampedArray)
BigBox.QuatUint8 = Types.Quaternion(Uint8Array)
BigBox.QuatUint16 = Types.Quaternion(Uint16Array)
BigBox.QuatUint32 = Types.Quaternion(Uint32Array)
BigBox.QuatInt8 = Types.Quaternion(Int8Array)
BigBox.QuatInt16 = Types.Quaternion(Int16Array)
BigBox.QuatInt32 = Types.Quaternion(Int32Array)
BigBox.QuatFloat32 = Types.Quaternion(Float32Array)

/** Complex types */
BigBox.ComplexUint8Clamped = Types.Complex(Uint8ClampedArray)
BigBox.ComplexUint8 = Types.Complex(Uint8Array)
BigBox.ComplexUint16 = Types.Complex(Uint16Array)
BigBox.ComplexUint32 = Types.Complex(Uint32Array)
BigBox.ComplexInt8 = Types.Complex(Int8Array)
BigBox.ComplexInt16 = Types.Complex(Int16Array)
BigBox.ComplexInt32 = Types.Complex(Int32Array)
BigBox.ComplexFloat32 = Types.Complex(Float32Array)

/** Real types */
BigBox.Uint8Clamped = Types.Real(Uint8ClampedArray)
BigBox.Uint8 = Types.Real(Uint8Array)
BigBox.Uint16 = Types.Real(Uint16Array)
BigBox.Uint32 = Types.Real(Uint32Array)
BigBox.Int8 = Types.Real(Int8Array)
BigBox.Int16 = Types.Real(Int16Array)
BigBox.Int32 = Types.Real(Int32Array)
BigBox.Float32 = Types.Real(Float32Array)
