import Tensor from '../../../tensor'
import Algebra from '../../../template/algebra'

import AxisReduceOperation from './operation'

export default class Norm extends AxisReduceOperation {
    constructor(args) {
        super(args, {
            resultant: function () {
                return Tensor.zeros({ type: Tensor.Float32, shape: [] })
            },
            symbolic: {
                template: {
                    init: function () {
                        return `const temp = new Array(${this.of.type.size}).fill(0)`
                    },
                    before: function () {},
                    during: function () {
                        return Algebra.assign(this.variables.temp.slice(0, 1),
                            Algebra.sum(Algebra.square(this.variables.of)), '+=').slice(0, 1)
                    },
                    after: function () {
                        return [
                            Algebra.assign(this.variables.result,
                                Algebra.squareRoot(this.variables.temp)),
                            `temp.fill(0)`
                        ].join('\n')
                    },
                    result: function () { return 'return R' }
                },
            }
        })
    }
}

