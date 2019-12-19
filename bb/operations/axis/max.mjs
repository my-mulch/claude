import Source from '../../template/source.mjs'
import Algebra from '../../template/algebra.mjs'
import AxisReduceOperation from './interface/reduce.mjs'

export default class Maximization extends AxisReduceOperation {
    constructor(args) { super(args) }

    start() {
        return new Source([`const temp = new Array(${this.of.header.type.size})`])
    }

    preLoop() {
        return new Source([
            `temp.fill(Number.NEGATIVE_INFINITY)`,
            this.indices.result
        ])
    }

    inLoop() {
        return new Source([
            this.indices.of,
            new Source()
                .if(Algebra.greaterThan(this.variables.of, this.variables.temp).slice(0, 1))
                .then(Algebra.assign(this.variables.temp, this.variables.of))
        ])

    }

    postLoop() {
        return Algebra.assign(this.variables.result, this.variables.temp)
    }
}
