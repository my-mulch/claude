import Tensor from '../../tensor'
import AxisOperation from './operation'

export default class Norm extends AxisOperation {
    constructor(args) {
        super(args)

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        if (this.of.size > 0) {
            this.symbolicBoilerplate() // super class method 
            this.symbolicSourceTemplate() // super class method, utilizes helpers below
        }

        /** Create */
        this.invoke = new Function('A,B,R', this.source)
    }

    /** Symbolic Implementation */
    start() { return `const temp = new Array(${this.of.type.size}).fill(0)` }
    
    preLoop() { }
    
    inLoop() {
        return Algebra.assign(this.variables.temp.slice(0, 1),
            Algebra.sum(Algebra.square(this.variables.of)), '+=').slice(0, 1)
    }

    postLoop() {
        return [
            Algebra.assign(this.variables.result,
                Algebra.squareRoot(this.variables.temp)),
            `temp.fill(0)`
        ].join('\n')
    }

    finish() { return 'return R' }

    /** (TODO) Pointwise Implementation */

    /** Resultant Tensor */
    resultant() { return Tensor.zeros({ type: Tensor.Float32, shape: [] }) }
}





























super(args, {
    resultant: function () {

    },
    symbolic: {
        template: {
            init: function () {
                return `const temp = new Array(${this.of.type.size}).fill(0)`
            },
            before: function () { },
            during: function () {
                return Algebra.assign(this.variables.temp.slice(0, 1),
                    Algebra.sum(Algebra.square(this.variables.of)), '+=').slice(0, 1)
            },
            after: function () {
                return [
                    Algebra.assign(this.variables.result,
                        Algebra.squareRoot(this.variables.temp)),
                    `temp.fill(0)`
                ].join('\n')
            },
            result: function () { return 'return R' }
        },
    }
})
