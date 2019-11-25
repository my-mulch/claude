import Tensor from '../../tensor'
import Assignment from '../pair/assign'
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
        this.invoke = new Function('A,B,R', [this.source.join('\n'), 'return R'].join('\n'))

        /** Template */
        if (!args.template)
            this.invoke = this.invoke.bind(this, this.result, this.with, this.result)
    }

    symbolicSourceTemplate() {
        this.source = []

        for (let i = 0, seen = 0; i < this.result.shape[this.axes[0]]; i++) {
            const region = SLICE_CHARACTER.repeat(this.result.shape.length).split('')
            const insert = (this.entries[seen] + seen) === i

            region[this.axes[0]] = i

            if (insert) {
                this.source.push('A = this.result', 'B = this.with', 'R = this.result')
                this.source.push(new Assignment({ of: this.result, with: this.with, region, }).source)
                seen++
            }

            else {
                const slice = region.slice()
                slice[this.axes[0]] = i - seen
                const fill = this.of.slice({ region: slice })

                this.source.push('A = this.result', `B = this.of.slice({region: ${JSON.stringify(slice)}})`, 'R = this.result')
                this.source.push(new Assignment({ of: this.result, with: fill, region, }).source)
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
