import Algebra from '../../algebra'
import ElementOperation from './operation'

export default class Mean extends ElementOperation {
    constructor(args) {
        super({ ...args, axes: args.axes || [...args.of.shape.keys()] })

        this.invoke = new Function([
            `const temp = new Array(${this.tensors.A.type.size}).fill(0)`,

            this.loops.outer.join('\n'),
            this.indices.R,
            this.loops.inner.join('\n'),
            this.indices.A,

            Algebra.assign(
                this.variables.T,
                this.variables.A, '+='),

            '}'.repeat(this.loops.inner.length),

            Algebra.assign(
                this.variables.R,
                Algebra.scale(this.variables.T, 1 / this.dimensions.inner)),

            `temp.fill(0)`,

            '}'.repeat(this.loops.outer.length),

            'return this.tensors.R'
        ].join('\n'))
    }
}
