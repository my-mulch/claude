import Algebra from '../../template/algebra'
import AxisOperation from '../../operation'

export default class AxisReduceCompareOperation extends AxisOperation {
    constructor(args, placeholder, comparator) {
        super(args)

        this.comparator = comparator
        this.placeholder = placeholder

        this.invoke = new Function('A,B,R', [
            `const temp = new Array(${this.of.type.size}).fill(0)`,

            this.loops.outer.join('\n'),
            this.indices.result,

            `temp.fill(${this.placeholder})`,

            this.loops.inner.join('\n'),
            this.indices.of,

            Algebra.if(
                this.comparator(this.variables.of, this.variables.temp).slice(0, 1),
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
