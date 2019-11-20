import Algebra from '../../template/algebra'
import Adjugate from './adjugate'
import LinearAlgebraOperation from './operation.mjs'

export default class Inverse extends LinearAlgebraOperation {
    constructor(args) {
        /** Superclass */
        super(args)

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        if (this.of.size > 0) {
            this.pointwiseSourceBoilerplate() // super class method
            this.pointwiseSourceTemplate() // super class method, utilizes helpers below
        }

        /** Create */
        this.invoke = new Function('A,B,R', [this.source, 'return R'].join('\n'))
    }

    /** Pointwise Implementation */
    start() {
        this.adjugate = new Adjugate(this)

        this.source = [
            `const T = new Array(${this.of.type.size})`,
            `const D = ${this.adjugate.determinant.invoke()}`,
        ]
    }

    inLoop() {
        const T = Algebra.variable({ symbol: 'T', size: this.of.type.size, index: 0 })
        const R = Algebra.variable({ symbol: 'R.data', index: this.result.header.flatIndex([r, c]), size: this.result.type.size })
        const D = Algebra.variable({ symbol: 'D.data', size: this.of.type.size, index: 0 })

        this.source.push(Algebra.divide(T, R, D))
        this.source.push(Algebra.assign(R, T))
    }

    finish() {
        this.source = [this.adjugate.source, this.source,].flat(Number.POSITIVE_INFINITY).join('\n')
    }

    /** (TODO) Symbolic Implementation */
}
