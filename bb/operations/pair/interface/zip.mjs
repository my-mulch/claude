import PairOperation from './index.mjs'

export default class ArithmeticPairOperation extends PairOperation {
    constructor(args) {
        /** Superclass */
        super(args)

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
}
