import Algebra from '../../algebra'
import AxisOperation from './operation'

export default class Exponential extends AxisOperation {
    constructor(args) {
        super(args)

        this.invoke = new Function([
            this.loops.total.join('\n'),

            this.indices.A,
            this.indices.R,

            Algebra.assign(
                this.variables.R,
                Algebra.exp(this.variables.A)
            ),

            '}'.repeat(this.axes.total.length),

            `return this.tensors.R`
        ].join('\n')).bind(this)
    }
}
