import Algebra from '../algebra'
import ElementOperation from './operation'

export default class Maximum extends ElementOperation {
    constructor(A, B, R, axes) {
        super(A, B, R, axes, {
            before: Algebra.assign(
                this.symbolic.variables.T,
                Algebra.negativeInfinity(this.symbolic.variables.T.length)
            ),

            inside: Algebra.if(
                Algebra.greaterThan(this.symbolic.variables.T, this.symbolic.variables.A).slice(0, 1),
                Algebra.assign(this.symbolic.variables.T, this.symbolic.variables.A)
            ),

            after: Algebra.assign(this.symbolic.variables.R, this.symbolic.variables.T),
        })
    }
}
