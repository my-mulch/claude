import Algebra from '../../algebra'
import PairOperation from './operation'

export default class Assignment extends PairOperation {
    constructor(A, B, R) {
        super(A, B, R, Algebra.assign(
            this.symbolic.variables.R,
            this.symbolic.variables.A))
    }
}
