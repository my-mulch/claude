import Tensor from '../../tensor'
import Source from '../../template/source'
import { __Math__ } from '../../resources'

export default class Mesh {
    constructor(args) {
        /** Properties */
        this.of = args.of
        this.axes = [...this.of.keys()]
        this.shapes = this.of.map(function (dimension) { return dimension.length })

        /** Result */
        this.result = args.result || this.resultant()

        /** Initialize */
        this.symbolicSourceTemplate()

        /** Create */
        this.invoke = new Function('A,B,R', [this.source, 'return R'].join('\n')).bind(this)

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(this, this.of, this.with, this.result)
    }

    /** Symbolic Implementation */
    symbolicSourceTemplate() {
        this.source = new Source([
            `let i = 0`,
            new Source().nestedFor(this.axes, this.shapes, [
                this.of.map(function (_, i) {
                    return `R.data[i++] = A[${i}][i${i}]`
                })
            ])
        ])
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

