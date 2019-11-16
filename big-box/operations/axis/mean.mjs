import Algebra from '../../template/algebra'
import ElementOperation from './operation'

export default class Mean extends ElementOperation {
    constructor(args) {
        super({ ...args, axes: args.axes || [...args.of.shape.keys()] })

        this.invoke = new Function('A,B,R', [
            `const temp = new Array(${this.of.type.size}).fill(0)`,

            this.loops.outer.join('\n'),
            this.indices.result,
            this.loops.inner.join('\n'),
            this.indices.of,

            Algebra.assign(
                this.variables.temp,
                this.variables.of, '+='),

            '}'.repeat(this.loops.inner.length),

            Algebra.assign(
                this.variables.result,
                Algebra.scale(this.variables.temp, 1 / this.dimensions.inner)),

            `temp.fill(0)`,

            '}'.repeat(this.loops.outer.length),

            'return R'
        ].join('\n'))

        if (!args.template)
            this.invoke = this.invoke.bind(null, this.of, this.with, this.result)
    }
}
