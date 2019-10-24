import Algebra from '../../algebra'
import PairOperation from './operation'

export default class Subtraction extends PairOperation {
    constructor(A, B, R) {
        super(A, B, R, Algebra.assign(this.symbols.R, Algebra.subtract(this.symbols.A, this.symbols.B)))
    }
}
