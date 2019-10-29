import Algebra from '../algebra'
import ElementOperation from './operation'

export default class Maximum extends ElementOperation {
    constructor(A, B, R, { axes }) {
        super(A, B, R, { axes }, function () {
            return {
                before: Algebra.assign(
                    this.variables.T,
                    Algebra.NEGATIVE_INFINITY(this.variables.T.length)
                ),

                inside: Algebra.if(
                    Algebra.greaterThan(this.variables.A, this.variables.T).slice(0, 1),
                    Algebra.assign(this.variables.T, this.variables.A)
                ),

                after: Algebra.assign(this.variables.R, this.variables.T),
            }
        })
    }
}
