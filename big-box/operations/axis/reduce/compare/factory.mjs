import AxisReduceCompareOperation from './operation'

export default function (placeholder, operation) {
    return class extends AxisReduceCompareOperation {
        constructor(args) {
            super({ ...args, axes: args.axes || [...args.of.shape.keys()] }, placeholder, operation)
        }
    }
}