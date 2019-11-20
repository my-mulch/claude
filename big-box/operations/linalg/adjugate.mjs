import Algebra from '../../template/algebra'
import Determinant from './determinant'
import LinearAlgebraOperation from './operation.mjs'
import { indexTemplate } from './utils.mjs'

export default class Adjugate extends LinearAlgebraOperation {
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
        this.source = []
        this.determinant = new Determinant(this)
    }

    inLoop() {
        const sign = Math.pow(-1, (r + c) % 2)
        const minor = Determinant.minor(indexTemplate(this.size), c, r)
        const determinant = this.determinant.pointwiseSource(minor)
        const cofactor = sign < 0 ? Algebra.negate(determinant) : determinant

        this.source.push(Algebra.assign(Algebra.variable({
            index: this.result.header.flatIndex([r, c]),
            symbol: 'R.data',
            size: this.result.type.size
        }), cofactor))
    }

    finish() { this.source = this.source.join('\n') }

    /** (TODO) Symbolic Implementation */
}
