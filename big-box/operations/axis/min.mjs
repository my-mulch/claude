import Algebra from '../../template/algebra'
import ElementOperation from './operation'

export default class Minimum extends ElementOperation {
    constructor(args) {
        super({ ...args, axes: args.axes || [...args.of.shape.keys()] })

        this.invoke = new Function('A,B,R', [
            `const temp = new Array(${this.of.type.size}).fill(0)`,

            this.loops.outer.join('\n'),
            this.indices.result,

            `temp.fill(Number.POSITIVE_INFINITY)`,

            this.loops.inner.join('\n'),
            this.indices.of,

            Algebra.if(
                Algebra.lessThan(this.variables.of, this.variables.temp).slice(0, 1),
                Algebra.assign(this.variables.temp, this.variables.of)
            ),

            '}'.repeat(this.loops.inner.length),
            Algebra.assign(this.variables.result, this.variables.temp),
            '}'.repeat(this.loops.outer.length),

            'return R'
        ].join('\n'))

        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }
}
