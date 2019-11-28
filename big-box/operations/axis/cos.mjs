import Source from '../../template/source'
import Algebra from '../../template/algebra'
import AxisOperation from './operation'

export default class Cosine extends AxisOperation {
    constructor(args) {
        /** Defaults */
        args.axes = args.axes || []

        /** Superclass */
        super(args)

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        super.symbolicSourceBoilerplate()
        super.symbolicSourceTemplate()

        /** Create */
        this.invoke = new Function('A,B,R', [this.source, 'return R'].join('\n'))

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }

    /** 
     * 
     * 
     * Symbolic Implementation 
     * 
     * 
     * */

    start() { }

    preLoop() {
        return new Source([this.indices.result])
    }

    inLoop() {
        return new Source([
            this.indices.of,
            Algebra.assign(this.variables.result, Algebra.cos(this.variables.of))
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
