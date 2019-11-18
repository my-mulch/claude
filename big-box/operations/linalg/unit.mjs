import Norm from './norm'
import Division from '../pair/divide'
import AxisOperation from './operation'

export default class Unit extends AxisOperation {
    constructor(args) {
        super(args)

        this.norm = new Norm({ of: this.of })
        this.divide = new Division({
            of: this.of,
            with: this.norm.result,
            result: this.result,
            template: args.template
        })
    }

    invoke() {
        this.norm.invoke()
        return this.divide.invoke()
    }
}

