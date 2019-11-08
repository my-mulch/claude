import Tensor from '../../tensor'
import Algebra from '../../algebra'
import Determinant from './determinant'
import { indexTemplate } from './utils.mjs'

export default class Adjugate {
    constructor(args) {
        this.tensors = {}
        this.tensors.A = Tensor.tensor({ data: args.of })
        this.tensors.R = args.result || this.resultant()

        this.size = this.tensors.A.shape[0]

        this.determinant = new Determinant(args)

        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource()

        this.invoke = new Function([
            this.pointwise.source.join('\n'),
            'return this.tensors.R'
        ].join('\n')).bind(this)
    }

    resultant() {
        return Tensor.zeros({
            shape: this.tensors.A.shape,
            type: this.tensors.A.type
        })
    }

    pointwiseSource() {
        const adjugate = []

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const sign = Math.pow(-1, (r + c) % 2)
                const minor = Determinant.minor(indexTemplate(this.size), c, r)
                const determinant = this.determinant.pointwiseSource(minor)
                const cofactor = sign < 0 ? Algebra.negate(determinant) : determinant

                adjugate.push(Algebra.assign(Algebra.variable({
                    index: this.tensors.R.header.flatIndex([r, c]),
                    symbol: 'this.tensors.R.data',
                    size: this.tensors.R.type.size
                }), cofactor))
            }
        }

        return adjugate
    }
}
