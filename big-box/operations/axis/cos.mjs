import Algebra from '../algebra'
import ElementOperation from './operation'

export default class Cosine extends ElementOperation {
    constructor(A, B, R, { axes = [] }) {
        super(A, B, R, axes, function () {
            return {
                inside: Algebra.assign(
                    this.variables.R,
                    Algebra.cos(this.variables.A)
                )
            }
        })
    }

    static resultant(A, B, R) { return super.resultant(A, B, R, { axes: [] }) }
}

