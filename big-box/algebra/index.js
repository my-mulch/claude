import { __split__ } from './utils'

export default class Algebra {
    constructor({ size, prefix }) {
        this.size = size
        this.prefix = prefix

        this.o1 = [...new Array(this.size).keys()]
        this.o2 = [...new Array(this.size).keys()]
    }

    __add__(o1, o2) {
        if (o1.size === 1 && o2.size === 1)
            return `(${o1} + ${o2})`

        const [a, b, c, d] = __split__(o1, o2)

        return [
            this.__add__(a, c),
            this.__add__(b, d),
        ]
    }

    __subtract__(o1, o2) {
        if (o1.size === 1 && o2.size === 1)
            return `(${o1} - ${o2})`

        const [a, b, c, d] = __split__(o1, o2)

        return [
            this.__subtract__(a, c),
            this.__subtract__(b, d),
        ]
    }

    __multiply__(o1, o2) {
        if (o1.size === 1 && o2.size === 1)
            return `(${o1} * ${o2})`

        const [a, b, c, d] = __split__(o1, o2)

        return [
            this.subtract(
                this.__multiply__(a, c),
                this.__multiply__(this.__conjugate__(d), b)
            ),

            this.__add__(
                this.__multiply__(d, a),
                this.__multiply__(b, this.__conjugate__(c))
            )
        ]
    }

    __conjugate__(o1, o2) {
        if (o1.size === 1 && o2.size === 1)
            return `(${o1})`

        const [a, b] = __split__(o1)

        this.__conjugate__(a, this.__negate__(b))
    }

    __negate__(o1, o2) {
        if (o1.size === 1 && o2.size === 1)
            return `-(${o1})`

        const [a, b] = __split__(o1)

        this.__negate__(a, b)
    }
}
