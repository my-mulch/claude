import Types from './types'
import Tensor from './tensor'
import Operations from './operations'

/** Numeric Types */
Object.assign(Tensor, Types)

/** Static Operations */
Object.assign(Tensor, Operations.wrap(function ([name, operation]) {
    return [name, function (args) { return new operation(args).invoke() }]
}))

/** Instance Operations */
Object.assign(Tensor.prototype, Operations.wrap(function ([name, operation]) {
    return [name, function (args) { return new operation({ of: this, ...args }).invoke() }]
}))

/** Cached Operations */
Tensor.cached = Operations

export default Tensor
