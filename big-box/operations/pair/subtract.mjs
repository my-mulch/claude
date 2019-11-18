import Algebra from '../../template/algebra.mjs'
import PairOperationFactory from './factory'

export default PairOperationFactory({
    before: function () { },
    during: function () {
        return Algebra.assign(
            this.variables.result,
            Algebra.subtract(this.variables.of, this.variables.with))
    },
    after: function () { return 'return R' }
})
