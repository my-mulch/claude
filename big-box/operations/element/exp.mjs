import Algebra from '../../algebra'
import ElementOperation from './operation'

export default class Exponential extends ElementOperation {
    constructor(A, B, R, axes) {
        super(A, B, R, axes, {
            inside: Algebra.assign(
                this.variables.R,
                Algebra.exp(this.variables.A)
            )
        })
    }
}

