import Source from '../../template/source.mjs'
import Algebra from '../../template/algebra.mjs'
import AxisMapOperation from './interface/map.mjs'

export default class Cosine extends AxisMapOperation {
    constructor(args) { super(args) }

    preLoop() {
        return new Source([this.indices.result])
    }

    inLoop() {
        return new Source([
            this.indices.of,
            Algebra.assign(this.variables.result, Algebra.cos(this.variables.of))
        ])
    }
}

