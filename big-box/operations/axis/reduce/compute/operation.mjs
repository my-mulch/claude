import AxisOperation from '../../operation'

export default class AxisReduceComputeOperation extends AxisOperation {
    constructor(args, operations) {
        super(args)

        this.after = operations.after.bind(this)
        this.inside = operations.inside.bind(this)

        this.invoke = new Function('A,B,R', [
            `const temp = new Array(${this.of.type.size}).fill(0)`,

            this.loops.outer.join('\n'),
            this.indices.result,
            this.loops.inner.join('\n'),
            this.indices.of,

            this.inside(),

            '}'.repeat(this.loops.inner.length),

            this.after(),

            `temp.fill(0)`,

            '}'.repeat(this.loops.outer.length),

            'return R'
        ].join('\n'))

        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }
}
