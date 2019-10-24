import Algebra from '../../algebra'
import ElementOperation from './operation'

export default class Minimum extends ElementOperation {
    constructor(A, B, R, axes) {
        super(A, B, R, axes, {
            before: Algebra.assign(
                this.variables.T,
                Algebra.positiveInfinity(this.variables.T.length)
            ),

            inside: Algebra.if(
                Algebra.lessThan(this.variables.T, this.variables.A).slice(0, 1),
                Algebra.assign(this.variables.T, this.variables.A)
            ),

            after: Algebra.assign(this.variables.R, this.variables.T),
        })
    }
}
