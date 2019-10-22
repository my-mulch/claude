import Algebra from '../../algebra'
import Opertation from '../operations'

import { init } from '../../operations/utils'
import { test, result, symbolic } from '../element/utils'

export default new Opertation({
    test,
    init,
    result,
    symbolic: function () {
        return new Function('A, B, R', [
            `const temp = new Array(${A.type.size})`,
            ...outerLoops,
            RIndex,
            `temp.fill(0)`,
            ...innerLoops,
            AIndex,
            ...Algebra.assign(sT, sA, '+='),
            '}'.repeat(innerLoopAxes.length),
            ...Algebra.assign(sR, sT.map(function (temp) { return `${temp} / ${innerSize}` })),
            '}'.repeat(outerLoopAxes.length),
            'return R'
        ].join('\n'))
    }
})
