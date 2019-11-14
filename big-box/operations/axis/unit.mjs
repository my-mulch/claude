import Norm from './norm'
import Division from '../pair/division'
import ElementOperation from './operation'

export default class Unit extends ElementOperation {
    constructor(args) {
        super(args)

        this.norm = new Norm({ of: this.tensors.A })
        this.division = new Division({ of: this.tensors.A, with: this.norm.invoke() })

        this.invoke = this.division.invoke
    }
}

