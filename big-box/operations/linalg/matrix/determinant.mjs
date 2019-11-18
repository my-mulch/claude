import Tensor from '../../tensor'
import Algebra from '../../template/algebra'
import MatrixOperation from '../operation'
import { indexTemplate } from './utils'

export default class Determinant extends MatrixOperation {
    constructor(args) {
        super(args, {
            route: function () { return this.pointwise() },
            resultant: function () { return Tensor.zeros({ shape: [], type: this.of.type.size }) },
            pointwise: function (matrix = indexTemplate(this.size)) {
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
        })
    }

    static minor(matrix, r, c) {
        const size = Math.sqrt(matrix.length)

        return matrix.filter(function (_, index) {
            if (index % size === c) return false // in column
            if (Math.floor(index / size) === r) return false // in row

            return true
        })
    }
}
