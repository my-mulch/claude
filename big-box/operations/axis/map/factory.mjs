import AxisMapOperation from './operation'

export default function (operation) {
    return class extends AxisMapOperation {
        constructor(args) { super(args, operation) }
    }
}
