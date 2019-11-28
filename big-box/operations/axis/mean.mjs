import Algebra from '../../template/algebra'
import AxisOperation from './operation'

export default class Mean extends AxisOperation {
    constructor(args) {
        /** Defaults */
        args.axes = args.axes || [...args.of.shape.keys()]

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

    start() {
        return new Source([`const temp = new Array(${this.of.type.size})`])
    }

    preLoop() {
        return new Souce([
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
