import Algebra from '../algebra'
import PairOperation from './operation'

export default class Division extends PairOperation {
    constructor(A, B, R) {
        super(A, B, R, function () {
            return {
                inside: Algebra.divide(
                    this.symbolic.variables.R,
                    this.symbolic.variables.A,
                    this.symbolic.variables.B)
            }
        })
    }
}
