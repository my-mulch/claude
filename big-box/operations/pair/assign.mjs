import Algebra from '../../template/algebra.mjs'
import PairOperationFactory from './factory'

export default PairOperationFactory({
    before: function () { return this.original = args.of },
    inner: function () { return Algebra.assign(this.variables.of, this.variables.with) },
    after: function () { return 'return this.original' }
})
