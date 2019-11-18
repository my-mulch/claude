import Algebra from '../../../../template/algebra'
import AxisReduceCompareOperationFactory from './operation'

export default {
    max: AxisReduceCompareOperationFactory(Number.NEGATIVE_INFINITY, Algebra.greaterThan),
    min: AxisReduceCompareOperationFactory(Number.POSITIVE_INFINITY, Algebra.lessThan),
}
