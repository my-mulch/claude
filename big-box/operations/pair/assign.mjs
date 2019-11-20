import Algebra from '../../template/algebra.mjs'
import PairOperation from './operation.mjs'

export default class Assignment extends PairOperation {
    constructor(args) {
        /** Defaults */
        const A = args.of.slice({ region: args.region || [] })

        /** Superclass */
        super({ ...args, of: A })

        /** Result */
        this.result = A
        this.original = args.of

        /** Initialize */
        if (this.of.size > 0) {
            this.symbolicBoilerplate() // super class method 
            this.symbolicSourceTemplate() // super class method, utilizes helpers below
        }

        /** Create */
        this.invoke = new Function('A,B,R', [this.source, 'return this.original'].join('\n')).bind(this)

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(this, this.of, this.with, this.result)
    }

    /** Symbolic Implementation */
    start() { }

    preLoop() { }

    inLoop() {
        return Algebra.assign(this.variables.of, this.variables.with)
    }

    postLoop() { }

    finish() { }

    /** (TODO) Pointwise Implementation */
}
