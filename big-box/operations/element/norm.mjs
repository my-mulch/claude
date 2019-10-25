import Algebra from '../algebra'
import ElementOperation from './operation'

export default class Norm extends ElementOperation {
    constructor(A, B, R, axes) {
        super(A, B, R, axes, {
            before: Algebra.assign(
                this.symbolic.variables.T,
                Algebra.zero(this.symbolic.variables.T.length)),

            inside: Algebra.assign(
                this.symbolic.variables.T,
                Algebra.square(this.symbolic.variables.A), '+='),

            after: Algebra.assign(
                this.symbolic.variables.R,
                Algebra.squareRoot(this.symbolic.variables.T)),
        })
    }
}

