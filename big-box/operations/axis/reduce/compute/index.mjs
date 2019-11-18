import Tensor from '../../../../tensor'
import Algebra from '../../../../template/algebra'
import AxisReduceComputeOperation from './operation'

export default {
    sum: class Summation extends AxisReduceComputeOperation {
        constructor(args) {
            super({ ...args, axes: args.axes || [...args.of.shape.keys()] }, {
                inner: function () {
                    return Algebra.assign(
                        this.variables.temp,
                        this.variables.of, '+=')
                },
                after: function () {
                    return Algebra.assign(
                        this.variables.result,
                        this.variables.temp)
                }
            })
        }
    },
    mean: class Mean extends AxisReduceComputeOperation {
        constructor(args) {
            super({ ...args, axes: args.axes || [...args.of.shape.keys()] }, {
                inner: function () {
                    return Algebra.assign(
                        this.variables.temp,
                        this.variables.of, '+=')
                },
                after: function () {
                    return Algebra.assign(
                        this.variables.result,
                        Algebra.scale(this.variables.temp, 1 / this.dimensions.inner))
                }
            })
        }
    },
    norm: class Norm extends AxisReduceComputeOperation {
        constructor(args) {
            super({ ...args, result: args.result || Tensor.zeros({ type: Tensor.Float32, shape: [] }) }, {
                inner: function () {
                    return Algebra.assign(
                        this.variables.temp.slice(0, 1),
                        Algebra.sum(Algebra.square(this.variables.of)), '+=').slice(0, 1)
                },
                after: function () {
                    return Algebra.assign(
                        this.variables.result,
                        Algebra.squareRoot(this.variables.temp))
                }
            })
        }
    }
}
