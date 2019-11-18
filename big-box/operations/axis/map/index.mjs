import Algebra from '../../../template/algebra'
import AxisMapOperation from './operation'

export default {
    cos: class Cosine extends AxisMapOperation {
        constructor(args) { super(args, Algebra.cos) }
    },
    sin: class Sine extends AxisMapOperation {
        constructor(args) { super(args, Algebra.sin) }
    },
    exp: class Exponential extends AxisMapOperation {
        constructor(args) { super(args, Algebra.exp) }
    },
    negate: class Negation extends AxisMapOperation {
        constructor(args) { super(args, Algebra.negate) }
    }
}
