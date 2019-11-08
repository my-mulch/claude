import Algebra from '../../algebra'
import PairOperation from './operation'

export default class Division extends PairOperation {
    constructor(args) {
        super(args)

        this.invoke = new Function([
            this.loops.total.join('\n'),

            Object.values(this.indices).join('\n'),

            Algebra.divide(
                this.variables.R,
                this.variables.A,
                this.variables.B),

            '}'.repeat(this.axes.total.length),

            'return this.tensors.R',
        ].join('\n')).bind(this)
    }
}
