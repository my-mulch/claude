import Algebra from '../../../template/algebra'
import AxisMapOperationFactory from './factory'

export default {
    cos: AxisMapOperationFactory(Algebra.cos),
    sin: AxisMapOperationFactory(Algebra.sin),
    exp: AxisMapOperationFactory(Algebra.exp),
    negate: AxisMapOperationFactory(Algebra.negate),
}
