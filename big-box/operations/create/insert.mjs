import Tensor from '../../tensor'
import { SLICE_CHARACTER } from '../../resources'

export default class Insert {
    constructor(args) {
        /** Properties */
        this.entries = args.entries.sort()
        this.axes = args.axes || [args.of.shape.length - 1]

        /** Result */
        this.of = Tensor.tensor({ data: args.of })
        this.with = Tensor.tensor({ data: args.with })
        this.result = args.result || this.resultant()

        /** Initialize */
        this.symbolicSourceTemplate()

        /** Create */
        this.invoke = new Function('A,B,R', [this.source, 'return R'].join('\n'))

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(this, this.of, this.with, this.result)
    }

    static feed(region, source) {
        return `this.result.assign({ region: ${JSON.stringify(region)}, with: ${source} })`
    }

    symbolicSourceTemplate() {
        this.source = []

        for (let i = 0, seen = 0; i < this.result.shape[this.axes[0]]; i++) {
            const region = new Array(this.result.shape.length).fill(SLICE_CHARACTER)
            region[this.axes[0]] = i

            if (this.entries[seen] !== undefined && this.entries[seen] + seen === i) {
                this.source.push(Insert.feed(region, 'this.with'))
                seen++
            } else {
                const slice = region.slice()
                slice[this.axes[0]] = i - seen
                this.source.push(Insert.feed(region, `this.of.slice({region:${JSON.stringify(slice)} })`))
            }
        }
    }

    resultant() {
        return Tensor.zeros({
            type: this.of.type,
            shape: this.of.shape.map(function (dimension, axis) {
                if (axis === this.axes[0])
                    return dimension + this.entries.length

                return dimension
            }, this),
        })
    }
}
