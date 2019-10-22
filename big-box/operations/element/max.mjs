import Algebra from '../../algebra'
import Opertation from '../operations'

import { init } from '../../operations/utils'
import { test, result, symbolic } from '../element/utils'

export default new Opertation({
    test, init, result, symbolic,
    operations: [
        function () { return `temp.fill(Number.NEGATIVE_INFINITY)` },
        function ({ AV, AT }) {
            return `if(${Algebra.max(AV, AT).map(function (comparison) {
                return new Array(comparison)
            }).reduce(Algebra.and)}){
                ${Algebra.assign(AT, AV).join('\n')}
            }`
        },
        function ({ RV, TV }) {
            return Algebra.assign(sR, sT).join('\n')
        }
    ]
})


