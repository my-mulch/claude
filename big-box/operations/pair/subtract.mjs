import Algebra from '../../algebra'
import PairOperation from './operation'

export default class Subtraction extends PairOperation {
    constructor(A, B, R) {
        super(A, B, R, Algebra.assign(
            this.symbolic.variables.R,
            Algebra.subtract(this.symbolic.variables.A, this.symbolic.variables.B)))
    }
}
