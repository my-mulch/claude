import Source from '../../template/source'
import Algebra from '../../template/algebra'
import Tensor from '../../tensor'
import AxisOperation from './operation'
import { __Math__ } from '../../resources'

export default class Insert extends AxisOperation {
    constructor(args) {
        /** Default */
        args.axes = args.axes || [args.of.shape.length - 1]

        /** Superclass */
        super(args)

        /** Properties */
        this.entries = args.entries.sort(__Math__.subtract).map(Number)

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        this.symbolicBoilerplate()
        this.symbolicSourceTemplate()

        /** Create */
        this.invoke = new Function('A,B,R', [this.source.join('\n'), 'return R'].join('\n'))

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(this, this.of, this.with, this.result)
    }

    symbolicBoilerplate() {
        /** Loops */
        this.loops = {}
        this.loops.total = Source.loopAxes(this.axes.order, this.result)
        this.loops.outer = Source.loopAxes(this.axes.outer, this.result)
        this.loops.inner = Source.loopAxes(this.axes.inner, this.result)

        /** Strides */
        this.strides = {}
        this.strides.of = this.of.strides
        this.strides.with = this.with.strides
        this.strides.result = this.result.strides

        /** Scalars */
        this.scalars = {}
        this.scalars.of = this.axes.total.map(function (axis) { return axis === this.axes.inner[0] ? `(${Source.prefix(axis)} - seen)` : Source.prefix(axis) }, this)
        this.scalars.with = this.axes.total.map(function (axis) { return this.axes.with.includes(axis) ? Source.prefix(axis) : 0 }, this)
        this.scalars.result = this.axes.total.map(Source.prefix)

        /** Indices */
        this.indices = {}
        this.indices.of = Source.index('AIndex', this.scalars.of.slice().reverse(), this.strides.of.slice().reverse(), this.of.offset)
        this.indices.with = Source.index('BIndex', this.scalars.with.slice().reverse(), this.strides.with.slice().reverse(), this.with.offset)
        this.indices.result = Source.index('RIndex', this.scalars.result.slice().reverse(), this.strides.result.slice().reverse(), this.result.offset)

        /** Variables */
        this.variables = {}
        this.variables.of = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: this.of.type.size })
        this.variables.with = Algebra.variable({ symbol: 'B.data', index: 'BIndex', size: this.with.type.size })
        this.variables.result = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: this.result.type.size })
    }

    symbolicSourceTemplate() {
        this.source = []

        this.source.push('let seen = 0')
        this.source.push(...this.loops.outer)
        this.source.push('seen = 0')
        this.source.push(...this.loops.inner)

        this.source.push(this.indices.of)
        this.source.push(this.indices.with)
        this.source.push(this.indices.result)

        this.source.push(`const insert = (this.entries[seen] + seen) === i${this.axes.inner[0]}`)

        this.source.push(`if(insert){`)
        this.source.push('seen++')
        this.source.push(Algebra.assign(this.variables.result, this.variables.with).join('\n'))
        this.source.push(`}`)

        this.source.push('else {')
        this.source.push(Algebra.assign(this.variables.result, this.variables.of).join('\n'))
        this.source.push('}')

        this.source.push('}'.repeat(this.axes.order.length))
    }

    start() { }
    beforeLoop() { }
    inLoop() { }
    afterLoop() { }
    finish() { }

    resultant() {
        return Tensor.zeros({
            type: this.of.type,
            shape: this.of.shape.map(function (dimension, axis) {
                if (axis === this.axes.inner[0])
                    return dimension + this.entries.length

                return dimension
            }, this),
        })
    }
}
