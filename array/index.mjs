import util from 'util' // node's utils

import {
    shapeRaw, shapeAlign, // shape utils
    initTyped, initRangeTyped, // typed utils
    selfAxesAndShape, pairAxesAndShape, // operation utils
} from './utils'

import Types from './types'
import Header from './header'
import Operations from './operations'

import { __Math__, ARRAY_SPACER, ARRAY_REPLACER } from './resources'

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
                type: args.type || BigBox.Float32,
            }),
            init: function () {
                if (args.with.constructor === Array) {
                    return initTyped({
                        size: this.size,
                        type: this.type,
                        rawArray: args.with.flat(Number.POSITIVE_INFINITY),
                    })
                }

                else if (args.with.constructor === String || args.with.constructor === Number) {
                    return initTyped({
                        size: this.size,
                        type: this.type,
                        rawArray: [args.with],
                    })
                }

                else if (args.with.constructor === BigBox.Int8 ||
                    args.with.constructor === BigBox.Uint8 ||
                    args.with.constructor === BigBox.Uint8Clamped ||
                    args.with.constructor === BigBox.Int16 ||
                    args.with.constructor === BigBox.Uint16 ||
                    args.with.constructor === BigBox.Int32 ||
                    args.with.constructor === BigBox.Uint32 ||
                    args.with.constructor === BigBox.Float32
                ) {
                    if (args.with.type !== this.type)
                        return new this.type.array(args.with)

                    return args.with
                }

                else throw 'Usage: bb.array({ with: <String|Number|Array|TypedArray>, type: <Object> })'
            }
        })
    }

    static zeros(args) {
        return new BigBox({
            header: new Header({
                shape: args.shape,
                type: args.type || BigBox.Float32
            })
        })
    }

    static ones(args) {
        return new BigBox({
            header: new Header({
                shape: args.shape,
                type: args.type || BigBox.Float32
            }),
            init: function () { return new this.type(this.size).fill(1) }
        })
    }

    static arange(args) {
        const stop = args.stop
        const step = args.step || 1
        const start = args.start || 0

        return new BigBox({
            header: new Header({
                shape: [__Math__.round((stop - start) / step), 1],
                type: args.type || BigBox.Float32
            }),
            init: function () {
                return initRangeTyped({
                    size: this.size,
                    type: this.type,
                    start, stop, step
                })
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
                shape: [num, 1],
                type: args.type || BigBox.Float32
            }),
            init: function () {
                return initRangeTyped({
                    size: this.size,
                    type: this.type,
                    start, stop, step
                })
            }
        })
    }


    static rand(args) {
        return new BigBox({
            header: new Header({
                shape: args.shape,
                type: args.type || BigBox.Float32
            }),
            init: function () {
                const data = new this.type(this.size)

                for (let i = 0; i < data.length; i++)
                    data[i] = __Math__.random() - 1

                return data
            }
        })
    }

    static randint(args) {
        const low = args.low || 0
        const high = args.high

        return new BigBox({
            header: new Header({
                shape: args.shape,
                type: args.type || BigBox.Int32
            }),
            init: function () {
                const data = new this.type(this.size)

                for (let i = 0; i < data.length; i++)
                    data[i] = opsSuite.utils.randint({ low, high })

                return data
            }
        })
    }

    static eye(args) {
        return new BigBox({
            header: new Header({
                shape: args.shape,
                type: args.type || BigBox.Float32
            }),
            init: function () {
                const data = new this.type(this.size)
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

        if (args.type.name.startsWith('Complex') &&
            !old.type.name.startsWith('Complex'))

            if (shape[shape.length] % 2)
                throw 'When changing type to a complex array, the last axis must be divisible by two'
            else
                shape[shape.length - 1] /= 2

        if (args.type.name.startsWith('Quat') &&
            !old.type.name.startsWith('Quat'))

            if (shape[shape.length] % 4)
                throw 'When changing type to a quaternion array, the last axis must be divisible by four'
            else
                shape[shape.length - 1] /= 4



        return new BigBox({
            header: new Header({
                shape: shape,
                offset: this.offset,
                contig: this.contig,
                type: args.type || BigBox.Float32
            }),
            init: function () { return new this.type(old.data) }
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

        return opsSuite.call({
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

        return opsSuite
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

        return opsSuite.call({
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

        return opsSuite.call({
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
        return opsSuite.call({
            of: this,
            with: { id: '' },
            result: args.result || BigBox.eye({ shape: this.shape }),
            meta: { method: this.inverse.name }
        })
    }

    assign(args) {
        this.sanitize(args)

        const region = args.region
            ? this.slice({ with: args.region })
            : this

        opsSuite.call({
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
            return this.type.string({ o: index, data: this.data })

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
BigBox.QuatInt8 = Types.Quat(Int8Array)
BigBox.QuatInt16 = Types.Quat(Int16Array)
BigBox.QuatInt32 = Types.Quat(Int32Array)
BigBox.QuatUint8 = Types.Quat(Uint8Array)
BigBox.QuatUint16 = Types.Quat(Uint16Array)
BigBox.QuatUint32 = Types.Quat(Uint32Array)
BigBox.QuatFloat32 = Types.Quat(Float32Array)
BigBox.QuatUint8Clamped = Types.Quat(Uint8ClampedArray)

/** Complex types */
BigBox.ComplexInt8 = Types.Complex(Int8Array)
BigBox.ComplexInt16 = Types.Complex(Int16Array)
BigBox.ComplexInt32 = Types.Complex(Int32Array)
BigBox.ComplexUint8 = Types.Complex(Uint8Array)
BigBox.ComplexUint16 = Types.Complex(Uint16Array)
BigBox.ComplexUint32 = Types.Complex(Uint32Array)
BigBox.ComplexFloat32 = Types.Complex(Float32Array)
BigBox.ComplexUint8Clamped = Types.Complex(Uint8ClampedArray)

/** Real types */
BigBox.Int8 = Types.Real(Int8Array)
BigBox.Int16 = Types.Real(Int16Array)
BigBox.Int32 = Types.Real(Int32Array)
BigBox.Uint8 = Types.Real(Uint8Array)
BigBox.Uint16 = Types.Real(Uint16Array)
BigBox.Uint32 = Types.Real(Uint32Array)
BigBox.Float32 = Types.Real(Float32Array)
BigBox.Uint8Clamped = Types.Real(Uint8ClampedArray)
