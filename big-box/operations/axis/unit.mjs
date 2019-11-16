import Norm from './norm'
import Division from '../pair/division'
import ElementOperation from './operation'

export default class Unit extends ElementOperation {
    constructor(args) {
        super(args)

        this.norm = new Norm({ of: this.of })
        this.division = new Division({ of: this.of, with: this.norm.invoke(), template: args.template })

        this.invoke = this.division.invoke
    }
}

