import Algebra from '../algebra'
import PairOperation from './operation'

export default class Assignment extends PairOperation {
    constructor(A, B, R) {
        super(A, B, R, function () {
            return Algebra.assign(
                this.symbolic.variables.A,
                this.symbolic.variables.B)
        })
    }
}
