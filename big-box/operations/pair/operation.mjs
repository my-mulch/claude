import Tensor from '../../tensor'
import Source from '../../template/source'
import TensorOperation from '../operation'
import { __Math__ } from '../../resources'

export default class PairOperation extends TensorOperation {
    constructor(args) {
        /** Superclass */
        super(args)

        /** Result */
        this.result = args.result || this.resultant()

        /** Axes */
        this.axes = {}
        this.axes.total = [...new Array(__Math__.max(this.of.shape.length, this.with.shape.length)).keys()]

        /** Shapes */
        this.shapes = {}
        this.shapes.total = this.axes.total.map(this.shape.bind(this.result))

        /** Sizes */
        this.sizes = {}
        this.sizes.total = this.axes.total.reduce(this.size.bind(this.result), 1)
    }

    resultant() {
        const shape = []
        const maxLen = __Math__.max(this.of.shape.length, this.with.shape.length)

        for (let i = 0; i < maxLen; i++) {
            const bi = this.with.shape.length - 1 - i
            const ai = this.of.shape.length - 1 - i

            if (this.with.shape[bi] === 1 || this.with.shape[bi] === undefined)
                shape.push(this.of.shape[ai])

            else if (this.of.shape[ai] === 1 || this.of.shape[ai] === undefined)
                shape.push(this.with.shape[bi])

            else if (this.with.shape[bi] === this.of.shape[ai])
                shape.push(this.of.shape[ai])
        }

        return Tensor.zeros({ shape: shape.reverse(), type: this.of.type })
    }

    symbolicSourceBoilerplate() {
        /** Axes */
        this.axes.of = this.of.header.nonZeroAxes(this.axes.total)
        this.axes.with = this.with.header.nonZeroAxes(this.axes.total)
        this.axes.result = this.result.header.nonZeroAxes(this.axes.total)

        super.symbolicSourceBoilerplate()
    }

    symbolicSourceTemplate() {
        this.source = new Source([
            this.start(),

            new Source()
                .nestedFor(this.axes.total, this.shapes.total, [
                    Object.values(this.indices).join('\n'),
                    this.inLoop(),
                ]),

            this.finish()
        ])
    }
}

