import Types from '../types'
import Tensor from '../tensor'

export default class TensorOperation {
    constructor(args) {
        /** Sanitize */
        this.of = Tensor.tensor({ data: args.of })
        this.with = Tensor.tensor({ data: args.with })

        /** Promote */
        this.type = Types.promote(this.of, this.with)
        this.of = this.of.astype({ type: this.type })
        this.with = this.with.astype({ type: this.type })
    }
}
