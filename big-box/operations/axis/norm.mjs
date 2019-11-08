import Types from '../../types'
import Tensor from '../../tensor'
import Algebra from '../../algebra'
import ElementOperation from './operation'

export default class Norm extends ElementOperation {
    constructor(args) {
        super({
            ...args,
            axes: args.axes || [...args.of.shape.keys()],
            result: args.result || Tensor.zeros({ type: Types.Float32, shape: [] })
        })

        this.invoke = new Function([
            `const temp = new Array(${this.tensors.A.type.size}).fill(0)`,

            this.loops.outer.join('\n'),
            this.indices.R,
            this.loops.inner.join('\n'),
            this.indices.A,

            Algebra.assign(
                this.variables.T.slice(0, 1),
                Algebra.sum(Algebra.square(this.variables.A)), '+=').slice(0, 1),

            '}'.repeat(this.loops.inner.length),

            Algebra.assign(
                this.variables.R,
                Algebra.squareRoot(this.variables.T)),

            `temp.fill(0)`,

            '}'.repeat(this.loops.outer.length),

            'return this.tensors.R'
        ].join('\n'))
    }
}

