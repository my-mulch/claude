import Algebra from '../algebra'
import PairOperation from './operation'

export default class Multiplication extends PairOperation {
    constructor(A, B, R) {
        super(A, B, R, Algebra.assign(
            this.symbolic.variables.R,
            Algebra.divide(this.symbolic.variables.A, this.symbolic.variables.B)))
    }
}
