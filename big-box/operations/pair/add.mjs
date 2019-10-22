import Algebra from '../../algebra'
import PairOperation from './operation'

export default new PairOperation(function () {
    return Algebra.assign(this.R, Algebra.add(this.A, this.B))
})
