import util from 'util' // node's utils

import {
    isTypedArray,
    shapeRaw, shapeAlign, // shape utils
    selfAxesAndShape, pairAxesAndShape, // operation utils
} from './utils'

import Header from './header'
import Operations from './operations'

import { __Math__, ARRAY_SPACER, ARRAY_REPLACER } from '../resources/big-box'

export default class Tensor {
    constructor({ header, init = function () {
        return new this.type.array(this.size * this.type.size)
    } }) {
        for (const field in header)
            this[field] = header[field]

        this.header = header
        this.data = init.call(this)
    }

    static array(args) {
        return new Tensor({
            header: new Header({
                shape: shapeRaw({ data: args.with }),
                type: args.type,
            }),
            init: function () {
                if (isTypedArray({ data: args.with }))
                    return args.with

                const data = new this.type.array(this.size * this.type.size)
                const raw = [args.with].flat(Number.POSITIVE_INFINITY)

                for (let i = 0, j = 0; i < data.length; i += this.type.size, j++)
                    this.type.strIn({
                        value: String(raw[j % raw.length]).match(/(\+|-)*\s*\d+(\.\d*)?/g).map(_ => _.replace(/ +/g, "")),
                        i,
                        data
                    })

                return data
            }
        })
    }

    static zeros(args) {
        return new Tensor({
            header: new Header({
                shape: args.shape,
                type: args.type,
            })
        })
    }

    static ones(args) {
        return new Tensor({
            header: new Header({
                shape: args.shape,
                type: args.type,
            }),
            init: function () {
                return new this.type
                    .array(this.size * this.type.size)
                    .fill(1)
            }
        })
    }

    static arange(args) {
        const stop = args.stop
        const step = args.step || 1
        const start = args.start || 0

        return new Tensor({
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

        return new Tensor({
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
        return new Tensor({
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

        return new Tensor({
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
        return new Tensor({
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

    astype(args, old = this) {
        let shape = old.shape.slice()

        if (args.type.size > 1 && old.type.size === 1)
            shape[shape.length - 1] /= args.type.size

        return new Tensor({
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

    gpair(args, method) {
        if (args.with.shape)
            args.with = shapeAlign({
                short: args.with,
                delta: this.shape.length - args.with.shape.length
            })

        const meta = pairAxesAndShape.call(this, args)

        return Operations.call({
            of: this,
            with: args.with,
            result: args.result || new Tensor({
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
                result: args.result || new Tensor({
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
        return Operations.call({
            of: this,
            with: args.with,
            result: args.result || new Tensor({
                header: new Header({
                    type: this.type,
                    shape: [this.shape[0], args.with.shape[1]]
                })
            }),
            meta: { method: this.matMult.name }
        })
    }

    cross(args) {
        return Operations.call({
            of: this,
            with: args.with,
            result: args.result || new Tensor({
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
            result: args.result || Tensor.eye({
                shape: this.shape,
                type: this.type
            }),
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
        return new Tensor({
            header: this.header.slice(args.with),
            init: function () { return old.data }
        })
    }

    T(old = this) {
        return new Tensor({
            header: this.header.transpose(),
            init: function () { return old.data }
        })
    }

    reshape(args, old = this) {
        if (!this.contig)
            return Tensor
                .array({ with: this.toRaw() })
                .reshape({ shape: args.shape })

        return new Tensor({
            header: this.header.reshape(args.shape),
            init: function () { return old.data }
        })
    }

    toRaw(index = this.offset, depth = 0) {
        if (!this.shape.length || depth === this.shape.length)
            return this.type.strOut({ i: index, data: this.data })

        return [...new Tensor(this.shape[depth]).keys()].map(function (i) {
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
