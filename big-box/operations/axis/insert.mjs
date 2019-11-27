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
        this.invoke = new Function('A,B,R', [this.source, 'return R'].join('\n'))

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(this, this.of, this.with, this.result)
    }

    symbolicBoilerplate() {
        /** Axes */
        this.axis = this.axes.inner[0]

        /** Loops */
        this.loops = {}
        this.loops.total = Source.loopAxes(this.axes.order, this.result)
        this.loops.outer = Source.loopAxes(this.axes.outer, this.result)
        this.loops.inner = Source.loopAxes(this.axes.inner, this.result)

        /** Scalars */
        this.scalars = {}
        
        this.scalars.of = this.axes.total.map(Source.prefix)
        this.scalars.of[this.axis] = `(${Source.prefix(this.axis)} - seen)`

        this.scalars.with = this.axes.total.map(function (axis) { return this.axes.with.includes(axis) ? Source.prefix(axis) : 0 }, this)
        this.scalars.result = this.axes.total.map(Source.prefix)

        /** Variables */
        this.variables = {}
        this.variables.of = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: this.of.type.size })
        this.variables.with = Algebra.variable({ symbol: 'B.data', index: 'BIndex', size: this.with.type.size })
        this.variables.result = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: this.result.type.size })
    }

    symbolicSourceTemplate() {
        this.source = [
            this.start(),
            this.loops.outer.join('\n'),
            this.preLoop(),
            this.loops.inner.join('\n'),
            this.inLoop(),
            '}'.repeat(this.loops.inner.length),
            this.postLoop(),
            '}'.repeat(this.loops.outer.length),
            this.finish(),
        ].join('\n')
    }

    start() { return 'let seen = 0' }
    preLoop() { return 'seen = 0' }

    inLoop() {
        return new Source([
            /** Indices */
            new Source().const('AIndex').equals(this.of.offset).plus(Source.dot(this.of.strides.slice().reverse(), this.scalars.of.slice().reverse())),
            new Source().const('BIndex').equals(this.with.offset).plus(Source.dot(this.with.strides.slice().reverse(), this.scalars.with.slice().reverse())),
            new Source().const('RIndex').equals(this.result.offset).plus(Source.dot(this.result.strides.slice().reverse(), this.scalars.result.slice().reverse())),

            /** Insertion Check */
            new Source()
                .const('insert')
                .equals(`(this.entries[seen] + seen) === i${this.axes.inner[0]}`),

            /** Insertion */
            new Source()
                .if('insert')
                .then(['seen++', ...Algebra.assign(this.variables.result, this.variables.with)])
                .else([...Algebra.assign(this.variables.result, this.variables.of)])
        ])
    }

    postLoop() { }
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
