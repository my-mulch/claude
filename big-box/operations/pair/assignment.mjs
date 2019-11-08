import Algebra from '../../algebra'
import PairOperation from './operation'

export default class Assignment extends PairOperation {
    constructor(args) {
        const A = args.of.slice({ region: args.region || [] })
        super({ of: A, result: A, ...args })

        this.tensors.original = args.of

        this.invoke = new Function([
            this.loops.total.join('\n'),
            Object.values(this.indices).join('\n'),
            Algebra.assign(this.variables.A, this.variables.B),
            '}'.repeat(this.axes.total.length),
            'return this.tensors.original',
        ].join('\n')).bind(this)
    }
}
