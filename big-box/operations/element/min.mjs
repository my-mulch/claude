import Algebra from '../../algebra'
import ElementOperation from './operation'

export default new ElementOperation(function () {
    return {
        before: Algebra.assign(
            this.T,
            Algebra.positiveInfinity(this.T.length)
        ),

        inside: Algebra.if(
            Algebra.lessThan(this.T, this.A).slice(0, 1),
            Algebra.assign(this.T, this.A)
        ),

        after: Algebra.assign(this.R, this.T),
    }

})
