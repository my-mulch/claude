import Algebra from '../../template/algebra.mjs'
import PairOperation from './operation.mjs'

export default class Assignment extends PairOperation {
    constructor(args) {
        /** Superclass */
        super({
            ...args,
            of: args.of.slice({ region: args.region || [] }),
            result: args.of
        })

        /** Initialize */
        this.symbolicSourceBoilerplate()
        this.symbolicSourceTemplate()

        /** Create */
        this.invoke = new Function(
            'A = this.of',
            'B = this.with',
            'R = this.result',
            [this.source, 'return R'].join('\n'))
    }

    symbolicSourceBoilerplate() {
        this.shapes.total = this.axes.total.map(this.shape.bind(this.of))
        this.sizes.total = this.axes.total.reduce(this.size.bind(this.of), 1)

        super.symbolicSourceBoilerplate()
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
