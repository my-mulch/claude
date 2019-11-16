import Tensor from '../../tensor'
import Algebra from '../../template/algebra'
import Determinant from './determinant'
import { indexTemplate } from './utils.mjs'

export default class Adjugate {
    constructor(args) {
        this.of = Tensor.tensor({ data:args.of})
        this.result = args.result || this.resultant()

        this.size = this.of.shape[0]

        this.determinant = new Determinant(args)

        this.pointwise = {}
        this.pointwise.source = this.pointwiseSource()

        this.invoke = new Function('A,B,R', [
            this.pointwise.source.join('\n'),
            'return R'
        ].join('\n')).bind(this)

        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }

    resultant() {
        return Tensor.zeros({
            shape: this.of.shape,
            type: this.of.type
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
                    index: this.result.header.flatIndex([r, c]),
                    symbol: 'R.data',
                    size: this.result.type.size
                }), cofactor))
            }
        }

        return adjugate
    }
}
