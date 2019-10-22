import Algebra from '../../algebra'
import ElementOperation from './operation'

export default new ElementOperation(function () {
    return {
        before: Algebra.assign(
            this.T,
            Algebra.negativeInfinity(this.T.length)
        ),

        inside: Algebra.if(
            Algebra.greaterThan(this.T, this.A).slice(0, 1),
            Algebra.assign(this.T, this.A)
        ),

        after: Algebra.assign(this.R, this.T),
    }

})
