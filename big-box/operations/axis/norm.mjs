import Types from '../../types'
import Tensor from '../../tensor'
import Algebra from '../../template/algebra'
import AxisOperation from './operation'

export default class Norm extends AxisOperation {
    constructor(args) {
        super({
            ...args,
            axes: args.axes || [...args.of.shape.keys()],
            result: args.result || Tensor.zeros({ type: Types.Float32, shape: [] })
        })

        this.invoke = new Function('A,B,R', [
            `const temp = new Array(${this.of.type.size}).fill(0)`,

            this.loops.outer.join('\n'),
            this.indices.result,
            this.loops.inner.join('\n'),
            this.indices.of,

            Algebra.assign(
                this.variables.temp.slice(0, 1),
                Algebra.sum(Algebra.square(this.variables.of)), '+=').slice(0, 1),

            '}'.repeat(this.loops.inner.length),

            Algebra.assign(
                this.variables.result,
                Algebra.squareRoot(this.variables.temp)),

            `temp.fill(0)`,

            '}'.repeat(this.loops.outer.length),

            'return R'
        ].join('\n'))

        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }
}

