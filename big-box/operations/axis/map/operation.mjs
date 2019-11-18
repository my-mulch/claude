import AxisOperation from '../operation'

export default class AxisMapOperation extends AxisOperation {
    constructor(args, operation) {
        super(args)
        
        this.operation = operation

        this.invoke = new Function('A,B,R', [
            this.loops.total.join('\n'),

            this.indices.of,
            this.indices.result,

            Algebra.assign(
                this.variables.result,
                this.operation(this.variables.of)
            ),

            '}'.repeat(this.axes.total.length),

            `return R`
        ].join('\n'))

        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }
}
