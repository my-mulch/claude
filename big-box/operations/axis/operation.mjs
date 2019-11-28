import Tensor from '../../tensor'
import Source from '../../template/source'
import TensorOperation from '../operation'

export default class AxisOperation extends TensorOperation {
    constructor(args) {
        super(args)

        /** Axes */
        this.axes = {}
        this.axes.inner = args.axes
        this.axes.total = [...this.of.shape.keys()]
        this.axes.outer = Tensor.difference(this.axes.total, this.axes.inner)
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
        return Tensor.zeros({
            type: this.of.type,
            shape: this.of.shape.filter(this.unselectedAxes, this),
            strides: this.of.strides.filter(this.unselectedAxes, this),
        })
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
            this.start(),

            new Source().nestedFor(this.axes.outer, this.shapes.outer, [
                this.preLoop(),

                new Source().nestedFor(this.axes.inner, this.shapes.inner, [
                    this.inLoop(),
                ]),

                this.postLoop(),
            ]),

            this.finish(),
        ])
    }
}

