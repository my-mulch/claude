import Types from './types/index.mjs'
import Tensor from './tensor/index.mjs'
import Operations from './operations/index.mjs'

/** Extensions */
Object.assign(Tensor, Math, {
    add: function (a, b) { return a + b },
    subtract: function (a, b) { return a - b },
    divide: function (a, b) { return a / b },
    multiply: function (a, b) { return a * b },

    intersection: function (a1, a2) {
        return a1.filter(function (value) {
            return a2.includes(value)
        })
    },
    
    difference: function (a1, a2) {
        return a1.filter(function (value) {
            return !a2.includes(value)
        })
    }
})

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
