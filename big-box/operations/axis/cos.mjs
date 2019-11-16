import Algebra from '../../template/algebra'
import AxisOperation from './operation'

export default class Cosine extends AxisOperation {
    constructor(args) {
        super(args)

        this.invoke = new Function('A,B,R', [
            this.loops.total.join('\n'),

            this.indices.of,
            this.indices.result,

            Algebra.assign(
                this.variables.result,
                Algebra.cos(this.variables.of)
            ),

            '}'.repeat(this.axes.total.length),

            `return R`
        ].join('\n'))

        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }
}

