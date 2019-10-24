import Algebra from '../../algebra'
import PairOperation from './operation'

export default class Multiplication extends PairOperation {
    constructor(A, B, R) {
        super(A, B, R, Algebra.assign(this.symbols.R, Algebra.divide(this.symbols.A, this.symbols.B)))
    }
}
