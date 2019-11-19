import Norm from './norm'
import Division from '../pair/divide'
import AxisOperation from './operation'

export default class Unit extends AxisOperation {
    constructor(args) {
        /** Defaults */
        args.axes = args.axes || []

        /** Superclass */
        super(args)

        /** Norm */
        this.norm = new Norm({ of: this.of })

        /** Divide */
        this.divide = new Division({
            of: this.of,
            with: this.norm.result,
            result: this.result,
        })
    }

    invoke() {
        this.norm.invoke()
        return this.divide.invoke()
    }
}
