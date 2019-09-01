import Element from './element.mjs'

class Algebra {
    constructor(size) {
        this.size = size

        this.o = new Element(...[...new Array(size).keys()].map(function (e) { return `this.of.data[oi + ${e}]` }))
        this.w = new Element(...[...new Array(size).keys()].map(function (e) { return `this.with.data[wi + ${e}]` }))

        this.sum = this.fn('{ oi, ri }', this.o.sum())
        this.negate = this.fn('{ oi, ri }', this.o.negate())
        this.square = this.fn('{ oi, ri }', this.o.square())
        this.scale = this.fn('{ oi, ri, c }', this.o.scale('c'))
        this.conjugate = this.fn('{ oi, ri }', this.o.conjugate())

        this.add = this.fn('{ oi, wi, ri }', this.o.add(this.w))
        this.divide = this.fn('{ oi, wi, ri }', this.o.divide(this.w))
        this.subtract = this.fn('{ oi, wi, ri }', this.o.subtract(this.w))
        this.multiply = this.fn('{ oi, wi, ri }', this.o.multiply(this.w))
    }

    fn(args, body) {
        return new Function(args, body
            .toString()
            .split(',')
            .map(function (computation, i) {
                return `this.result.data[ri + ${i}] = ${computation}`
            })
            .join('\n')
            .concat('\n')
            .concat('return this.result'))
    }
}

export default {
    REAL: new Algebra(1),
    COMPLEX: new Algebra(2),
    OCTONION: new Algebra(8),
    QUATERNION: new Algebra(4),
}
