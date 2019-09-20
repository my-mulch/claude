import { __split__ } from './utils.mjs'

export default class Algebra {
    constructor({ dimension, prefix }) {
        this.prefix = prefix
        this.dimension = dimension

        this.o1 = [...new Array(this.dimension).keys()].map(function (e) { return `this.of.data[oi + ${e}]` })
        this.o2 = [...new Array(this.dimension).keys()].map(function (e) { return `this.with.data[wi + ${e}]` })

        this.add = this.__add__(this.o1, this.o2)
        this.subtract = this.__subtract__(this.o1, this.o2)
        this.multiply = this.__multiply__(this.o1, this.o2)
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

const Quaternion = new Algebra({ dimension: 4, prefix: 'Quat' })

console.log(Quaternion.multiply)