import Algebra from '../../algebra'
import ElementOperation from './operation'

export default class Norm extends ElementOperation {
    constructor(A, B, R, axes) {
        super(A, B, R, axes, {
            before: Algebra.assign(this.variables.T, Algebra.zero(this.variables.T.length)),
            inside: Algebra.assign(this.variables.T, Algebra.square(this.variables.A), '+='),
            after: Algebra.assign(this.variables.R, Algebra.squareRoot(this.variables.T)),
        })
    }
}

