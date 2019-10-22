
export default class Operation {
    constructor({ select, init, result, symbolic, pointwise, operations }) {
        this.__select__ = select.bind(this)
        this.__init__ = init.bind(this)
        this.__result__ = result.bind(this)
        this.__symbolic__ = symbolic.bind(this)
        this.__pointwise__ = pointwise.bind(this)

        this.__operations__ = operations
    }

    select(A, B, R, axes) {
        Object.assign(this, this.__init__(A, B, R, axes))

        return this.__select__(A, B, R, axes)(...this.__operations__)
    }
}
