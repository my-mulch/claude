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

    symbolicSourceTemplate() { // .set(`i${this.axes.last}`, `(i${this.axis.last} - seen)`) 
        /** Dimensions */
        this.dimensions = {}
        this.dimensions.inner
        this.dimensions.outer

        /** Indices */
        this.indices = {}
        this.indices.of = new Source().const('AIndex').equals(this.of.header.symbolicIndex())
        this.indices.with = new Source().const('BIndex').equals(this.with.header.symbolicIndex())
        this.indices.result = new Source().const('RIndex').equals(this.result.header.symbolicIndex())

        /** Variables */
        this.variables = {}
        this.variables.of = Algebra.variable({ symbol: 'A.data', index: 'AIndex', size: this.of.type.size })
        this.variables.with = Algebra.variable({ symbol: 'B.data', index: 'BIndex', size: this.with.type.size })
        this.variables.result = Algebra.variable({ symbol: 'R.data', index: 'RIndex', size: this.result.type.size })

        return super.symbolicSourceTemplate()
    }

    start() { return 'let seen = 0' }
    preLoop() { return 'seen = 0' }

    inLoop() {
        return new Source([

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
