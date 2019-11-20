import Tensor from '../../tensor'
import Algebra from '../../template/algebra'
import LinearAlgebraOperation from './operation.mjs'
import { indexTemplate } from './utils.mjs'

export default class Determinant extends LinearAlgebraOperation {
    constructor(args) {
        /** Superclass */
        super(args)

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        if (this.of.size > 0) {
            this.pointwiseSourceBoilerplate() // super class method
            this.pointwiseSourceTemplate()
        }

        /** Create */
        this.invoke = new Function('A,B,R', [this.source, 'return R'].join('\n'))

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }

    static minor(matrix, r, c) {
        const size = Math.sqrt(matrix.length)

        return matrix.filter(function (_, index) {
            if (index % size === c) return false // in column
            if (Math.floor(index / size) === r) return false // in row

            return true
        })
    }

    /** Resultant Tensor */
    resultant() { return Tensor.zeros({ shape: [], type: this.of.type.size }) }

    /** Pointwise Implementation */
    pointwiseSourceTemplate(matrix = indexTemplate(this.size)) {
        if (matrix.length === 1)
            return Algebra.variable({ symbol: 'A.data', size: this.of.type.size, index: this.of.header.flatIndex(matrix[0]) })

        const subDeterminants = []
        const size = Math.sqrt(matrix.length)

        for (let i = 0; i < size; i++) {
            const minor = Determinant.minor(matrix, 0, i)
            const subDeterminant = this.pointwise(minor)

            const factor = Algebra.variable({ symbol: 'A.data', size: this.of.type.size, index: this.of.header.flatIndex(matrix[i]) })
            const cofactor = Algebra.multiply(factor, subDeterminant)

            subDeterminants.push(Math.pow(-1, i % 2) > 0 ? cofactor : Algebra.negate(cofactor))
        }

        return subDeterminants.reduce(Algebra.add)
    }

    /** (TODO) Symbolic Implementation */
}
