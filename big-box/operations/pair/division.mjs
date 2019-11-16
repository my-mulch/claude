import Algebra from '../../template/algebra'
import PairOperation from './operation'

export default class Division extends PairOperation {
    constructor(args) {
        super(args)

        this.invoke = new Function('A,B,R', [
            this.loops.total.join('\n'),

            Object.values(this.indices).join('\n'),

            Algebra.divide(
                this.variables.result,
                this.variables.of,
                this.variables.with),

            '}'.repeat(this.axes.total.length),

            'return R',
        ].join('\n'))

        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }
}
