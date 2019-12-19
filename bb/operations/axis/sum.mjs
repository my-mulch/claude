import Source from '../../template/source.mjs'
import Algebra from '../../template/algebra.mjs'
import AxisReduceOperation from './interface/reduce.mjs'

export default class Summation extends AxisReduceOperation {
    constructor(args) { super(args) }

    start() {
        return new Source([`const temp = new Array(${this.of.header.type.size})`])
    }

    preLoop() {
        return new Source([
            this.indices.result,
            `temp.fill(0)`
        ])
    }

    inLoop() {
        return new Source([
            this.indices.of,
            Algebra.assign(this.variables.temp, this.variables.of, '+=')
        ])
    }

    postLoop() {
        return Algebra.assign(this.variables.result, this.variables.temp)
    }
}
