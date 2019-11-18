import Types from '../../types'
import Tensor from '../../tensor'

import { __Math__ } from '../../resources'

export default class PairOperation {
    constructor(args, { resultant, route, symbolic, pointwise }) {
        /** Operations */
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

        /** Routing */
        this.source = this.route()

        /** Invocation */
        this.invoke = new Function('A,B,R', this.source)

        /** Templating */
        if (!args.template)
            this.invoke = this.invoke.bind(this, this.of, this.with, this.result)
    }
}
