import Algebra from '../algebra'
import ElementOperation from './operation'

export default class Sine extends ElementOperation {
    constructor(A, B, R, { axes = [] }) {
        super(A, B, R, axes, function () {
            return {
                inside: Algebra.assign(
                    this.symbolic.variables.R,
                    Algebra.sin(this.symbolic.variables.A)
                )
            }
        })
    }

    static resultant(A, B, R) { return super.resultant(A, B, R, { axes: [] }) }
}
