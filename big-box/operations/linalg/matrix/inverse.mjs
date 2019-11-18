import Algebra from '../../template/algebra'
import Adjugate from './adjugate'
import MatrixOperation from './operation'

export default class Inverse extends MatrixOperation {
    constructor(args) {
        super(args, {
            route: function () { return this.pointwise() },
            resultant: function () { return Tensor.zeros(this.of) },
            pointwise: function () {
                this.adjugate = new Adjugate(args)

                const source = [
                    `const T = new Array(${this.of.type.size})`,
                    `const D = ${this.adjugate.determinant.invoke()}`,
                ]

                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        const T = Algebra.variable({ symbol: 'T', size: this.of.type.size, index: 0 })
                        const R = Algebra.variable({ symbol: 'R.data', index: this.result.header.flatIndex([r, c]), size: this.result.type.size })
                        const D = Algebra.variable({ symbol: 'D.data', size: this.of.type.size, index: 0 })

                        source.push(Algebra.divide(T, R, D))
                        source.push(Algebra.assign(R, T))
                    }
                }

                return [this.adjugate.source.join('\n'), source.join('\n')].flat(Number.POSITIVE_INFINITY)
            }
        })
    }
}
