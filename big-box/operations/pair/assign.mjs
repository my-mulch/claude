import Algebra from '../../template/algebra'
import PairOperation from './operation'

export default class Assignment extends PairOperation {
    constructor(args) {
        const A = args.of.slice({ region: args.region || [] })
        super({ ...args, of: A, result: A })

        this.original = args.of

        this.invoke = new Function('A,B,R', [
            this.loops.total.join('\n'),

            Object.values(this.indices).join('\n'),

            Algebra.assign(this.variables.of, this.variables.with),

            '}'.repeat(this.axes.total.length),

            'return this.original',
        ].join('\n')).bind(this)

        if (!args.template)
            this.invoke = this.invoke.bind(this, this.of, this.with, this.result)
    }
}
