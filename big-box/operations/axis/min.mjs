import Algebra from '../../../template/algebra'

import AxisReduceOperation from './operation'

export default class Min extends AxisReduceOperation {
    constructor(args) {
        super(args, {
            symbolic: {
                template: {
                    init: function () {
                        return `const temp = new Array(${this.of.type.size}).fill(0)`
                    },
                    before: function () { },
                    during: function () {
                        return Algebra.if(
                            Algebra.lessThan(this.variables.of, this.variables.temp).slice(0, 1),
                            Algebra.assign(this.variables.temp, this.variables.of)
                        )
                    },
                    after: function () {
                        return [
                            Algebra.assign(this.variables.result, this.variables.temp),
                            `temp.fill(Number.POSITIVE_INFINITY)`,
                        ].join('\n')
                    },
                    result: function () { return 'return R' }
                }
            }
        })
    }
}
