import Algebra from '../algebra'
import PairOperation from './operation'

export default class Assignment extends PairOperation {
    constructor(A, B, R, { region = [] }) {
        super(A = A.slice({ region }), B, R = A, function () {
            return {
                before: 'R = A; A = A.slice({ region: args.region || [] })',
                inside: Algebra.assign(
                    this.variables.A,
                    this.variables.B),
            }
        })
    }

    static resultant() { return {} }
}
