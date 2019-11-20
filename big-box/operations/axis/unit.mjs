import Norm from './norm'
import Division from '../pair/divide'
import Tensor from '../../tensor'
import AxisOperation from './operation'

export default class Unit extends AxisOperation {
    constructor(args) {
        /** Defaults */
        args.axes = args.axes || []

        /** Superclass */
        super(args)

        /** Result */
        this.result = args.result || this.resultant()

        /** Norm */
        this.norm = new Norm({ of: this.of })

        /** Divide */
        this.divide = new Division({
            of: this.of,
            with: this.norm.result,
            result: this.result,
        })
    }

    resultant() { return Tensor.zeros(this.of) }

    invoke() {
        this.norm.invoke()
        return this.divide.invoke()
    }
}
