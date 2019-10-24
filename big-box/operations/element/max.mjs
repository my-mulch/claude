import Algebra from '../../algebra'
import ElementOperation from './operation'

export default class Maximum extends ElementOperation {
    constructor(A, B, R, axes) {
        super(A, B, R, axes, {
            before: Algebra.assign(
                this.variables.T,
                Algebra.negativeInfinity(this.variables.T.length)
            ),

            inside: Algebra.if(
                Algebra.greaterThan(this.variables.T, this.variables.A).slice(0, 1),
                Algebra.assign(this.variables.T, this.variables.A)
            ),

            after: Algebra.assign(this.variables.R, this.variables.T),
        })
    }
}
