import TensorOperation from '../operation'

export default class AxisReduceOperation extends TensorOperation {
    constructor(args, { resultant, route, symbolic, pointwise }) {
        super(args, {
            route: route || function () {
                if (this.size < 50) return this.pointwise()

                return this.symbolic()
            },
            resultant: resultant || function () {
                return Tensor.zeros({
                    type: this.of.type,
                    shape: this.of.shape.filter(function (_, axis) {
                        return !this.axes.inner.includes(axis)
                    }, this)
                })
            },
            pointwise: pointwise || function () {

            },
            symbolic: symbolic || function () {

                
            }
        })
    }
}


