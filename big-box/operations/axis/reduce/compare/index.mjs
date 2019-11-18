import Algebra from '../../../../template/algebra'
import AxisReduceCompareOperation from './operation'

export default {
    max: class Maximum extends AxisReduceCompareOperation {
        constructor(args) {
            super({ ...args, axes: args.axes || [...args.of.shape.keys()] },
                Number.NEGATIVE_INFINITY, Algebra.greaterThan)
        }
    },
    min: class Minimum extends AxisReduceCompareOperation {
        constructor(args) {
            super({ ...args, axes: args.axes || [...args.of.shape.keys()] },
                Number.POSITIVE_INFINITY, Algebra.lessThan)
        }
    }
}
