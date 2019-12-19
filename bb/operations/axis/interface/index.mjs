import Tensor from '../../../tensor/index.mjs'
import Source from '../../../template/source.mjs'
import __Math__ from '../../arithmetic/index.mjs'
import TensorOperation from '../../interface.mjs'

export default class AxisOperation extends TensorOperation {
    constructor(args) {
        super(args)

        /** Axes */
        this.axes = {}
        this.axes.inner = args.axes
        this.axes.total = [...this.of.header.shape.keys()]
        this.axes.outer = __Math__.difference(this.axes.total, this.axes.inner)
        this.axes.order = this.axes.outer.concat(this.axes.inner)
        this.axes.last = this.axes.order[this.axes.order.length - 1]

        /** Shapes */
        this.shapes = {}
        this.shapes.outer = this.axes.outer.map(this.shape.bind(this.of))
        this.shapes.inner = this.axes.inner.map(this.shape.bind(this.of))

        /** Sizes */
        this.sizes = {}
        this.sizes.outer = this.axes.outer.reduce(this.size.bind(this.of), 1)
        this.sizes.inner = this.axes.inner.reduce(this.size.bind(this.of), 1)
    }

    unselectedAxes(_, axis) {
        return !this.axes.inner.includes(axis)
    }

    resultant() {
        return Tensor.zeros(
            this.of.header.shape.filter(this.unselectedAxes, this),
            this.of.header.type,
        )
    }

    symbolicSourceBoilerplate() {
        /** Axes */
        this.axes.of = this.axes.of || this.of.header.nonZeroAxes(this.axes.total)
        this.axes.with = this.axes.with || this.with.header.nonZeroAxes(this.axes.inner)
        this.axes.result = this.axes.result || this.result.header.nonZeroAxes(this.axes.outer)

        super.symbolicSourceBoilerplate()
    }

    symbolicSourceTemplate() {
        this.source = new Source([
            this.start &&
            this.start(),

            new Source().nestedFor(
                this.axes.outer,
                this.shapes.outer,
                [
                    this.preLoop &&
                    this.preLoop(),

                    new Source().nestedFor(
                        this.axes.inner,
                        this.shapes.inner,
                        [
                            this.inLoop &&
                            this.inLoop(),
                        ]),

                    this.postLoop &&
                    this.postLoop(),
                ]),

            this.finish &&
            this.finish(),
        ])
    }
}

