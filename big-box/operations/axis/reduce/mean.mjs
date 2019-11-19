import Algebra from '../../../template/algebra'

import AxisReduceOperation from './operation'

export default class Mean extends AxisReduceOperation {
    constructor(args) {
        super(args, {
            symbolic: {
                template: {
                    init: function () {
                        return `const temp = new Array(${this.of.type.size}).fill(0)`
                    },
                    before: function () { },
                    during: function () {
                        return Algebra.assign(this.variables.temp, this.variables.of, '+=')
                    },
                    after: function () {
                        return [
                            Algebra.assign(this.variables.result,
                                Algebra.scale(this.variables.temp, 1 / this.dimensions.inner)),
                            'temp.fill(0)'
                        ].join('\n')
                    },
                    result: function () { return 'return R' }
                },
            }
        })
    }
}
