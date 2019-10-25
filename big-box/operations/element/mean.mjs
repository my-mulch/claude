import Algebra from '../algebra'
import ElementOperation from './operation'

export default class Mean extends ElementOperation {
    constructor(A, B, R, axes) {
        super(A, B, R, axes, {
            before: Algebra.assign(
                this.symbolic.variables.T,
                Algebra.zero(this.symbolic.variables.T.length)),

            inside: Algebra.assign(
                this.symbolic.variables.T,
                this.symbolic.variables.A, '+='),

            after: Algebra.assign(
                this.symbolic.variables.R,
                Algebra.scale(this.symbolic.variables.T, 1 / this.symbolic.innerSize)),
        })
    }
}
