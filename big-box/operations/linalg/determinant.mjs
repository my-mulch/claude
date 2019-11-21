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

    static subMatrix(indices, r, c) {
        const size = Math.sqrt(indices.length)

        return indices.filter(function (_, index) {
            if (index % size === c) return false // in column
            if (Math.floor(index / size) === r) return false // in row

            return true
        })
    }

    static determinant(tensor, indices = indexTemplate(tensor.shape[0])) {
        if (indices.length === 1)
            return Algebra.variable({ symbol: 'A.data', size: tensor.type.size, index: tensor.header.flatIndex(indices[0]) })

        const subDeterminants = []
        const size = Math.sqrt(indices.length)

        for (let i = 0; i < size; i++) {
            const subMatrix = Determinant.subMatrix(indices, 0, i)
            const subDeterminant = Determinant.determinant(tensor, subMatrix)

            const factor = Algebra.variable({ symbol: 'A.data', size: tensor.type.size, index: tensor.header.flatIndex(indices[i]) })
            const cofactor = Algebra.multiply(factor, subDeterminant)

            subDeterminants.push(Math.pow(-1, i % 2) > 0 ? cofactor : Algebra.negate(cofactor))
        }

        return subDeterminants.reduce(Algebra.add)
    }

    /** Resultant Tensor */
    resultant() { return Tensor.zeros({ shape: [], type: this.of.type }) }

    /** Pointwise Implementation */
    pointwiseSourceBoilerplate() {
        /** Variables */
        this.variables = {}
        this.variables.result = Algebra.variable({
            symbol: 'R.data',
            index: this.result.offset,
            size: this.result.type.size
        })
    }

    pointwiseSourceTemplate() {
        this.source = [
            Algebra.assign(this.variables.result, Determinant.determinant(this.of))
        ].join('\n')
    }

    /** (TODO) Symbolic Implementation */
}