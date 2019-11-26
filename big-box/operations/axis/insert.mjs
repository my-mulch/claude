import Source from '../../template/source'
import Algebra from '../../template/algebra'
import Tensor from '../../tensor'
import AxisOperation from './operation'
import { SLICE_CHARACTER, __Math__ } from '../../resources'

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

        /** Strides */
        this.strides = {}
        this.strides.of = this.of.strides
        this.strides.with = this.with.strides
        this.strides.result = this.result.strides

        /** Scalars */
        this.scalars = {}
        this.scalars.of = this.axes.total.map(Source.prefix)
        this.scalars.with = this.axes.total.map(function (axis) { return this.axes.with.includes(axis) ? Source.prefix(axis) : 0 }, this)
        this.scalars.result = this.axes.total.map(Source.prefix)

        /** Indices */
        this.indices = {}
        this.indices.of = Source.index('AIndex', this.scalars.of, this.strides.of, this.of.offset)
        this.indices.with = Source.index('BIndex', this.scalars.with, this.strides.with, this.with.offset)
        this.indices.result = Source.index('RIndex', this.scalars.result, this.strides.result, this.result.offset)

        /** Variables */
        this.variables = {}
        this.variables.of = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: this.of.type.size })
        this.variables.with = Algebra.variable({ symbol: 'B.data', index: 'BIndex', size: this.with.type.size })
        this.variables.result = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: this.result.type.size })
    }

    symbolicSourceTemplate() {
        this.source = []

        this.source.push('let seen = 0')
        this.source.push(...this.loops.total)
        
        this.source.push(this.indices.of)
        this.source.push(this.indices.with)
        this.source.push(this.indices.result)
        
        this.source.push(`const insert = (this.entries[seen] + seen) === i${this.axes.inner[0]}`)
        this.source.push(`const region = (this.entries[seen] + seen) === i${this.axes.inner[0]}`)
        
        this.source.push(`if(insert){`)
        this.source.push(``)
        this.source.push(`}`)

        this.source.push('}'.repeat(this.axes.order.length))

    }

    inLoop() {
        for (let i = 0, seen = 0; i < this.result.shape[this.axes[0]]; i++) {
            const region = SLICE_CHARACTER.repeat(this.result.shape.length).split('')
            const insert = (this.entries[seen] + seen) === i

            region[this.axes[0]] = i

            if (insert) {
                this.source.push('A = this.result', 'B = this.with', 'R = this.result')
                this.source.push(new Assignment({ of: this.result, with: this.with, region }).source)
                seen++
            }

            else {
                const slice = region.slice()
                slice[this.axes[0]] = i - seen
                const fill = this.of.slice({ region: slice })

                this.source.push('A = this.result', `B = this.of.slice({region: ${JSON.stringify(slice)}})`, 'R = this.result')
                this.source.push(new Assignment({ of: this.result, with: fill, region, }).source)
            }
        }
    }

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
