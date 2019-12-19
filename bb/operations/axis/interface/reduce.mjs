import AxisOperation from './index.mjs'

export default class AxisReduceOperation extends AxisOperation {
    constructor(args) {
        /** Defaults */
        args.axes = args.axes || [...args.of.header.shape.keys()]

        /** Superclass */
        super(args)

        /** Result */
        this.result = args.result || this.resultant()

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
