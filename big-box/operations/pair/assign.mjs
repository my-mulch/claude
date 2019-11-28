import Algebra from '../../template/algebra.mjs'
import PairOperation from './operation.mjs'

export default class Assignment extends PairOperation {
    constructor(args) {
        /** Defaults */
        const A = args.of.slice({ region: args.region || [] })

        /** Superclass */
        super({ ...args, of: A, result: args.of })

        /** Initialize */
        this.symbolicSourceBoilerplate()
        this.symbolicSourceTemplate()

        /** Create */
        this.invoke = new Function('A,B,R', [this.source, 'return R'].join('\n')).bind(this)

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(this, this.of, this.with, this.result)
    }

    /** Symbolic Implementation */
    start() { }
    preLoop() { }

    inLoop() {
        return Algebra.assign(this.variables.of, this.variables.with).join('\n')
    }

    postLoop() { }
    finish() { }

    /** (TODO) Pointwise Implementation */
}
