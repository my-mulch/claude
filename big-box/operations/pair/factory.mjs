import Algebra from '../../template/algebra'
import PairOperation from './operation'

export default function (operation) {
    return class extends PairOperation {
        constructor(args) {
            super(args, {
                inner: function () {
                    return Algebra.assign(
                        this.variables.result,
                        operation(this.variables.of, this.variables.with))
                },
                after: function () { return 'return R' }
            })
        }
    }
}
