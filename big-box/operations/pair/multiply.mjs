import Algebra from '../../algebra'
import PairOperation from './operation'

export default new PairOperation(function ({ A, B, R }) {
    return Algebra.assign(R, Algebra.multiply(A, B))
})
