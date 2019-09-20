import { __split__ } from './utils.mjs'

export default class Algebra {
    constructor({ dimensions, prefix }) {
        this.prefix = prefix
        this.dimensions = dimensions

        this.o = function (_, d) { return `this.of.data[oi + ${d}]` }
        this.w = function (_, d) { return `this.with.data[wi + ${d}]` }
        this.r = function (expression, d) { return `this.result.data[ri + ${d}] = ${expression}` }

        this.o1 = new Array(this.dimensions).fill(null).map(this.o)
        this.o2 = new Array(this.dimensions).fill(null).map(this.w)

        this.add = this.__add__(this.o1, this.o2).flat(this.dimensions).map(this.r)
        this.sub = this.__subtract__(this.o1, this.o2).flat(this.dimensions).map(this.r)
        this.mul = this.__multiply__(this.o1, this.o2).flat(this.dimensions).map(this.r)
    }

    __add__(o1, o2) {
        if (o1.length === 1)
            return [`(${o1} + ${o2})`]

        const [a, b, c, d] = __split__(o1, o2)

        return [
            this.__add__(a, c),
            this.__add__(b, d),
        ]
    }

    __subtract__(o1, o2) {
        if (o1.length === 1)
            return [`(${o1} - ${o2})`]

        const [a, b, c, d] = __split__(o1, o2)

        return [
            this.__subtract__(a, c),
            this.__subtract__(b, d),
        ]
    }

    __multiply__(o1, o2) {
        if (o1.length === 1)
            return [`(${o1} * ${o2})`]

        const [a, b, c, d] = __split__(o1, o2)

        return [
            this.__subtract__(
                this.__multiply__(a, c),
                this.__multiply__(this.__conjugate__(d), b)
            ),

            this.__add__(
                this.__multiply__(d, a),
                this.__multiply__(b, this.__conjugate__(c))
            )
        ]
    }

    __conjugate__(o1) {
        if (o1.length === 1)
            return [`(${o1})`]

        const [a, b] = __split__(o1)

        return [
            this.__conjugate__(a),
            this.__negate__(b)
        ]
    }

    __negate__(o1) {
        if (o1.length === 1)
            return [`-(${o1})`]

        const [a, b] = __split__(o1)

        return [
            this.__negate__(a),
            this.__negate__(b)
        ]
    }
}

const Complex = new Algebra({ dimensions: 4, prefix: 'Complex' })

console.log(Complex.mul)

const data = {
    of: { data: [-5, 2] },
    with: { data: [10, 13] }
}
