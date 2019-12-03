import Source from '../../template/source.mjs'
import Algebra from '../../template/algebra.mjs'
import Tensor from '../../tensor/index.mjs'
import AxisOperation from './operation.mjs'
import { __Math__ } from '../../resources/index.mjs'

export default class Insert extends AxisOperation {
    constructor(args) {
        /** Defaults */
        args.axes = args.axes || [args.of.shape.length - 1]

        /** Superclass */
        super(args)

        /** Properties */
        this.entries = args.entries.sort(__Math__.subtract).map(Number)

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        this.symbolicSourceBoilerplate()
        this.symbolicSourceTemplate()

        /** Create */
        this.invoke = new Function(
            'A = this.of',
            'B = this.with',
            'R = this.result',
            [this.source, 'return R'].join('\n'))
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

    /** 
     * 
     * 
     * Symbolic Implementation 
     * 
     * 
     * */

    symbolicSourceBoilerplate() {
        /** Axes */
        this.axes.of = this.of.header.nonZeroAxes(this.axes.total)

        if (!this.axes.of[this.axes.last])
            this.axes.of[this.axes.last] = [`i${this.axes.last}`, this.of.strides[this.axes.last]]

        this.axes.of[this.axes.last][0] = `(i${this.axes.last} - seen)`
        this.axes.with = this.with.header.nonZeroAxes(this.axes.total)
        this.axes.result = this.result.header.nonZeroAxes(this.axes.total)

        /** Shapes */
        this.shapes = {}
        this.shapes.outer = this.axes.outer.map(super.shape.bind(this.result))
        this.shapes.inner = this.axes.inner.map(super.shape.bind(this.result))

        super.symbolicSourceBoilerplate()
    }

    start() { return new Source(['let seen = 0']) }
    preLoop() { return new Source(['seen = 0']) }

    inLoop() {
        return new Source([
            /** Indices */
            new Source(Object.values(this.indices)),

            /** Insertion Check */
            new Source([`const insert = (this.entries[seen] + seen) === i${this.axes.inner[0]}`]),

            /** Insertion */
            new Source()
                .if('insert')
                .then(['seen++', ...Algebra.assign(this.variables.result, this.variables.with)])
                .else([...Algebra.assign(this.variables.result, this.variables.of)])
        ])
    }

    postLoop() { }
    finish() { }

    /** 
     * 
     * 
     * (TODO) Literal Implementation 
     * 
     * 
     * */
}
