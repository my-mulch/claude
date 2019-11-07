import Algebra from '../../algebra'
import PairOperation from './operation'

export default class Multiplication extends PairOperation {
    constructor(A, B, R) {
        super(A, B, R, function () {
            return {
                inside: Algebra.assign(
                    this.variables.R,
                    Algebra.multiply(this.variables.A, this.variables.B))
            }
        })
    }
}
