import Tensor from '../../../tensor'

export default class MatrixOperation {
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

        /** Dimensions */
        this.rows = this.of.shape[0]
        this.cols = this.of.shape[1]
        this.like = this.of.shape[1]
        this.size = this.rows

        /** Routing */
        this.source = this.route()

        /** Invocation */
        this.invoke = new Function('A,B,R', [this.source, 'return R'].flat())

        /** Templating */
        if (!args.template)
            this.invoke = this.invoke.bind(this, this.of, this.with, this.result)
    }
}
