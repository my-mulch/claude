import Algebra from '../algebra'
import ElementOperation from './operation'

export default class Cosine extends ElementOperation {
    constructor(A, B, R, axes) {
        super(A, B, R, axes, {
            inside: Algebra.assign(
                this.symbolic.variables.R,
                Algebra.cos(this.symbolic.variables.A)
            )
        })
    }
}

