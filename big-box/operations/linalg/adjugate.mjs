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

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }

    /** Pointwise Implementation */
    start() {
        this.source = []
    }

    inLoop() {
        const sign = Math.pow(-1, (this.r + this.c) % 2)
        const subMatrix = Determinant.subMatrix(indexTemplate(this.size), this.c, this.r)
        const determinant = Determinant.determinant(this.of, subMatrix)
        const cofactor = sign < 0 ? Algebra.negate(determinant) : determinant

        this.source.push(Algebra.assign(Algebra.variable({
            index: this.result.header.flatIndex([this.r, this.c]),
            symbol: 'R.data',
            size: this.result.type.size
        }), cofactor))
    }

    finish() { this.source = this.source.join('\n') }

    determinant() {
        const source = [`const D = new Array(${this.of.type.size})`]

        const variable = Algebra.variable({ symbol: 'D', size: this.of.type.size, index: 0 })

        const value = new Array(this.size).fill(null).map(function (_, i) {
            return Algebra.multiply(
                Algebra.variable({ symbol: 'A.data', size: this.of.type.size, index: this.of.header.flatIndex([0, i]) }),
                Algebra.variable({ symbol: 'R.data', size: this.of.type.size, index: this.result.header.flatIndex([i, 0]) }))
        }, this).reduce(Algebra.add)

        source.push(Algebra.assign(variable, value))

        return source.join('\n')
    }

    /** (TODO) Symbolic Implementation */
}
