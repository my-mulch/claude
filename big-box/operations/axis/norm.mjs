import Types from '../../types'
import Algebra from '../../algebra'
import ElementOperation from './operation'

export default class Norm extends ElementOperation {
    constructor(A, B, R, { axes }) {
        super(A, B, R, { axes }, function () {
            return {
                before: Algebra.assign(
                    this.variables.T,
                    Algebra.ZERO(this.variables.T.length)),

                inside: Algebra.assign(
                    this.variables.T.slice(0, 1),
                    Algebra.sum(Algebra.square(this.variables.A)), '+=').slice(0, 1),

                after: Algebra.assign(
                    this.variables.R,
                    Algebra.squareRoot(this.variables.T)),
            }
        })
    }

    static resultant() { return { type: Types.Float32, shape: [] } }

}

