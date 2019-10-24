import Algebra from '../../algebra'
import ElementOperation from './operation'

export default class Sum extends ElementOperation {
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
                this.symbolic.variables.T),
        })
    }
}
