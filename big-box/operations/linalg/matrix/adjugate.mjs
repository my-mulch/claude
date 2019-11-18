import Algebra from '../../template/algebra'
import Determinant from './determinant'
import MatrixOperation from './operation'
import { indexTemplate } from './utils.mjs'

export default class Adjugate extends MatrixOperation {
    constructor(args) {
        super(args, {
            route: function () { return this.pointwise() },
            resultant: function () { return Tensor.zeros(this.of) },
            pointwise: function () {
                const source = []

                this.determinant = new Determinant(args)

                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        const sign = Math.pow(-1, (r + c) % 2)
                        const minor = Determinant.minor(indexTemplate(this.size), c, r)
                        const determinant = this.determinant.pointwiseSource(minor)
                        const cofactor = sign < 0 ? Algebra.negate(determinant) : determinant

                        source.push(Algebra.assign(Algebra.variable({
                            index: this.result.header.flatIndex([r, c]),
                            symbol: 'R.data',
                            size: this.result.type.size
                        }), cofactor))
                    }
                }

                return source.join('\n')
            }
        })
    }
}
