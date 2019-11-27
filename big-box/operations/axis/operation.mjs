import Tensor from '../../tensor'
import Source from '../../template/source'
import Algebra from '../../template/algebra'
import TensorOperation from '../operation'

export default class AxisOperation extends TensorOperation {
    constructor(args) {
        super(args)

        /** Axes */
        this.axes = {}
        this.axes.inner = args.axes
        this.axes.total = [...this.of.shape.keys()]
        this.axes.outer = Tensor.difference(this.axes.total, this.axes.inner)
        this.axes.last = this.axes.inner[this.axes.inner.length - 1]
    }

    resultant() {
        return Tensor.zeros({
            type: this.of.type,
            shape: this.of.shape.filter(function (_, axis) {
                return !this.axes.inner.includes(axis)
            }, this)
        })
    }

    symbolicSourceTemplate() {
        return new Source([
            this.start(), // implemented by subclass

            new Source().nestedFor(this.axes.outer, this.dimensions.outer, [
                this.preLoop(), // implemented by subclass

                new Source().nestedFor(this.axes.inner, this.dimensions.inner, [
                    this.inLoop(), // implemented by subclass
                ]),

                this.postLoop(), // implemented by subclass
            ]),

            this.finish(), // implemented by subclass
        ])
    }
}

