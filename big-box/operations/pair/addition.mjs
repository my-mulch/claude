import Algebra from '../../algebra'
import PairOperation from './operation'

export default class Addition extends PairOperation {
    constructor(args) {
        super(args)

        this.invoke = new Function([
            this.loops.total.join('\n'),

            Object.values(this.indices).join('\n'),

            Algebra.assign(
                this.variables.R,
                Algebra.addition(this.variables.A, this.variables.B)),

            '}'.repeat(this.axes.total.length),

            'return this.tensors.R',
        ].join('\n')).bind(this)
    }
}
