
export default class Operation {
    constructor({ test, init, result, symbolic, pointwise }) {
        this.__test__ = test.bind(this)
        this.__init__ = init.bind(this)
        this.__result__ = result.bind(this)
        this.__symbolic__ = symbolic.bind(this)
        this.__pointwise__ = pointwise.bind(this)
    }

    test(A, B, R, axes) {
        Object.assign(this, this.__init__(A, B, R, axes))

        return this.__test__()
    }
}
