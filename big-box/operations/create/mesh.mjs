import Tensor from '../../tensor'
import Source from '../../template/source'
import { __Math__ } from '../../resources'

export default class Mesh {
    constructor(args) {
        /** Properties */
        this.of = args.of

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        this.symbolicSourceTemplate()

        /** Create */
        this.invoke = new Function('A,B,R', [this.source.join('\n'), 'return R'].join('\n')).bind(this)

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(this, this.of, this.with, this.result)
    }

    /** Symbolic Implementation */
    loop(dimension, i) {
        return Source.loop(
            `let i${i} = 0`,
            `i${i} < ${dimension.length}`,
            `i${i}++`)
    }

    symbolicSourceTemplate() {
        this.source = []

        this.source.push(`let i = 0`)
        this.source.push(...this.of.map(this.loop))

        for (let i = 0; i < this.of.length; i++)
            this.source.push(`R.data[i++] = A[${i}][i${i}]`)

        this.source.push('}'.repeat(this.of.length))
    }

    size(all, dimension) {
        return all * dimension.length
    }

    resultant() {
        return Tensor.zeros({
            shape: [
                this.of.reduce(this.size, 1),
                this.of.length
            ]
        })
    }

    /** (TODO) Pointwise Implementation */
}

