import Element from './element.mjs'

class Algebra {
    constructor(size) {
        this.size = size

        this.o = new Element(...[...new Array(size).keys()].map(function (e) { return `this.of.data[oi + ${e}]` }))
        this.w = new Element(...[...new Array(size).keys()].map(function (e) { return `this.with.data[wi + ${e}]` }))

        this.sum = this.fn('{ oi, ri }', this.o.sum())
        this.negate = this.fn('{ oi, ri }', this.o.negate())
        this.square = this.fn('{ oi, ri }', this.o.square())
        this.assign = this.fn('{ oi, ri }', this.o.assign())
        this.scale = this.fn('{ oi, ri, c }', this.o.scale('c'))
        this.conjugate = this.fn('{ oi, ri }', this.o.conjugate())

        this.add = this.fn('{ oi, wi, ri }', this.o.add(this.w))
        this.divide = this.fn('{ oi, wi, ri }', this.o.divide(this.w))
        this.subtract = this.fn('{ oi, wi, ri }', this.o.subtract(this.w))
        this.multiply = this.fn('{ oi, wi, ri }', this.o.multiply(this.w))

        this.strIn = this.strIn.bind(this)
        this.strOut = this.strOut.bind(this)
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

    strOut({ i, data }) {
        const string =  new Element(...data.slice(i, i + this.size)).display()

        if(string.startsWith('+')) return string.slice(1)

        return string
    }

    strIn({ value, i, data }) {
        return this.assign.call({
            of: { data: value },
            result: { data },
        }, { oi: 0, ri: i })
    }
}

export default {
    REAL: new Algebra(1),
    COMPLEX: new Algebra(2),
    OCTONION: new Algebra(8),
    QUATERNION: new Algebra(4),
}
