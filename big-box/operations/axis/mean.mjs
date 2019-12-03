import Source from '../../template/source.mjs'
import Algebra from '../../template/algebra.mjs'
import AxisOperation from './operation.mjs'

export default class Mean extends AxisOperation {
    constructor(args) {
        /** Defaults */
        args.axes = args.axes || [...args.of.shape.keys()]

        /** Superclass */
        super(args)

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

    /** 
     * 
     * 
     * Symbolic Implementation 
     * 
     * 
     * */

    start() {
        return new Source([`const temp = new Array(${this.of.type.size})`])
    }

    preLoop() {
        return new Source([
            this.indices.result,
            `temp.fill(0)`
        ])
    }

    inLoop() {
        return new Source([
            this.indices.of,
            Algebra.assign(this.variables.temp, this.variables.of, '+=')
        ])
    }

    postLoop() {
        return Algebra.assign(this.variables.result,
            Algebra.scale(this.variables.temp, 1 / this.sizes.inner))
    }

    finish() { }

    /** 
     * 
     * 
     * (TODO) Literal Implementation 
     * 
     * 
     * */
}
