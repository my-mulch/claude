import Tensor from '../../../tensor'

export default class TensorOperation {
    constructor(args, { resultant, route, symbolic, pointwise }) {
        /** Initialize */
        this.route = route
        this.symbolic = symbolic
        this.pointwise = pointwise
        this.resultant = resultant

        /** Sanitize */
        this.of = Tensor.tensor({ data: args.of })
        this.with = Tensor.tensor({ data: args.with })

        /** Promote */
        this.type = Types.promote(this.of, this.with)
        this.of = this.of.astype({ type: this.type })
        this.with = this.with.astype({ type: this.type })
        this.result = args.result || this.resultant()

        /** Route */
        this.source = this.route()

        /** Create */
        this.invoke = new Function('A,B,R', this.source)

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(this, this.of, this.with, this.result)
    }
}
