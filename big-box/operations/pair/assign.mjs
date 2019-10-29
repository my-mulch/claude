import Algebra from '../algebra'
import PairOperation from './operation'

export default class Assignment extends PairOperation {
    constructor(A, B, R, { region = [] }) {
        super(A.slice({ region }), B, R = A, function () {
            return Algebra.assign(this.symbolic.variables.A, this.symbolic.variables.B)
            
        })
    }
}
