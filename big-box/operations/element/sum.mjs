import Algebra from '../../algebra'
import ElementOperation from './operation'

export default new ElementOperation(function () {
    return {
        before: Algebra.assign(this.T, Algebra.zero(this.T.length)),
        inside: Algebra.assign(this.T, this.A, '+='),
        after: Algebra.assign(this.R, this.T),
    }
})
