import Algebra from '../algebra'
import ElementOperation from './operation'

export default class Negate extends ElementOperation {
    constructor(A, B, R, { axes = [] }) {
        super(A, B, R, axes, function () {
            return {
                inside: Algebra.assign(
                    this.symbolic.variables.R,
                    Algebra.negate(this.symbolic.variables.A)
                )
            }
        })
    }

    static resultant(A, B, R, { axes = [] }) { return super.resultant(A, B, R, axes) }
}

