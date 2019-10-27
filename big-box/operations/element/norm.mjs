import Type from '../../type'
import Algebra from '../algebra'
import ElementOperation from './operation'

export default class Norm extends ElementOperation {
    constructor(A, B, R, axes) {
        super(A, B, R, axes, function () {
            return {
                before: Algebra.assign(
                    this.symbolic.variables.T,
                    Algebra.ZERO(this.symbolic.variables.T.length)),

                inside: Algebra.assign(
                    this.symbolic.variables.T.slice(0, 1),
                    Algebra.sum(Algebra.square(this.symbolic.variables.A)), '+=').slice(0, 1),

                after: Algebra.assign(
                    this.symbolic.variables.R,
                    Algebra.squareRoot(this.symbolic.variables.T)),
            }
        })
    }

    static resultant(A, B) { return { type: Type.Float32, shape: [] } }

}

