import Source from '../../../gen/source.mjs'
import Algebra from '../../../gen/algebra.mjs'
import AxisOperation from './interface.mjs'

export default class Negation extends AxisOperation {
    constructor(args) { super({ axes: args.axes || AxisOperation.NONE, ...args }) }

    preLoop() {
        return new Source([this.indices.result])
    }

    inLoop() {
        return new Source([
            this.indices.of,
            Algebra.assign(this.variables.result, Algebra.negate(this.variables.of))
        ])
    }
}
