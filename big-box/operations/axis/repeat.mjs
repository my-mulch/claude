import Tensor from '../../tensor/index.mjs'
import Source from '../../template/source.mjs'
import Algebra from '../../template/algebra.mjs'
import AxisOperation from './operation.mjs'

export default class Repeat extends AxisOperation {
    constructor(args) {
        /** Defaults */
        args.axes = args.axes || [args.of.header.shape.length - 1]

        /** Superclass */
        super(args)

        /** Properties */
        this.count = args.count || 1

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
        const shape = this.of.header.shape.slice()
        shape[this.axes.inner[0]] *= this.count
        
        return Tensor.zeros(shape, this.of.header.type)
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
        this.axes.with = this.with.header.nonZeroAxes(this.axes.total)
        this.axes.result = this.result.header.nonZeroAxes(this.axes.total)
        this.axes.result[this.axes.last][0] = 'r'

        super.symbolicSourceBoilerplate()
    }

    start() { }
    preLoop() { }

    inLoop() {
        return new Source([
            this.indices.of,

            new Source()
                .for(`let r = i${this.axes.last}*${this.count}, c = 0`, `c < ${this.count}`, 'r++, c++')
                .then([
                    this.indices.result,
                    Algebra.assign(this.variables.result, this.variables.of)
                ])
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
