
export default class Algebra {
    static split(o1 = [], o2 = []) {
        return [
            o1.slice(0, o1.length / 2), o1.slice(o1.length / 2),
            o2.slice(0, o2.length / 2), o2.slice(o2.length / 2),
        ]
    }

    static variable({ symbol, size, index }) {
        return new Array(size).fill(null).map(function (_, i) {
            return `${symbol}[${index}+${i}]`
        })
    }

    static min(o1, o2) {
        if (o1.length === 1) return [`(${o1}<${o2})`]

        const [a, b, c, d] = Algebra.split(o1, o2)

        return [Algebra.min(a, c), Algebra.min(b, d)].flat(Number.POSITIVE_INFINITY)
    }

    static add(o1, o2) {
        if (o1.length === 1) return [`(${o1}+${o2})`]

        const [a, b, c, d] = Algebra.split(o1, o2)

        return [Algebra.add(a, c), Algebra.add(b, d)].flat(Number.POSITIVE_INFINITY)
    }

    static subtract(o1, o2) {
        if (o1.length === 1) return [`(${o1}-${o2})`]

        const [a, b, c, d] = Algebra.split(o1, o2)

        return [Algebra.subtract(a, c), Algebra.subtract(b, d)].flat(Number.POSITIVE_INFINITY)
    }

    static multiply(o1, o2) {
        if (o1.length === 1) return [`${o1}*${o2}`]

        const [a, b, c, d] = Algebra.split(o1, o2)

        return [
            Algebra.subtract(
                Algebra.multiply(a, c),
                Algebra.multiply(Algebra.conjugate(d), b)
            ),
            Algebra.add(
                Algebra.multiply(d, a),
                Algebra.multiply(b, Algebra.conjugate(c))
            )
        ].flat(Number.POSITIVE_INFINITY)
    }

    static divide(o1, o2) {
        if (o1.length === 1) return [`(${o1}/${o2})`]

        return Algebra.scale(
            Algebra.multiply(o1, Algebra.conjugate(o2)),
            `(1/${Algebra.sum(Algebra.square(o2))})`
        )
    }

    static squareRoot(o1) {
        if (o1.length === 1) return [`Math.sqrt(${o1})`]

        const [a, b] = Algebra.split(o1)

        return [Algebra.squareRoot(a), Algebra.squareRoot(b)].flat(Number.POSITIVE_INFINITY)
    }

    static norm(o1) {
        if (o1.length === 1) return [`(${o1})`]

        return Algebra.squareRoot(Algebra.squareSum(o1))
    }

    static squareSum(o1) {
        return Algebra.sum(Algebra.square(o1))
    }

    static sum(o1) {
        if (o1.length === 1) return [`(${o1})`]

        const [a, b] = Algebra.split(o1)

        return Algebra.add(Algebra.sum(a), Algebra.sum(b))
    }

    static scale(o1, c) {
        if (o1.length === 1) return [`(${o1}*${c})`]

        const [a, b] = Algebra.split(o1)

        return [Algebra.scale(a, c), Algebra.scale(b, c)].flat(Number.POSITIVE_INFINITY)
    }

    static square(o1) {
        if (o1.length === 1) return [`(${o1}*${o1})`]

        const [a, b] = Algebra.split(o1)

        return [Algebra.square(a), Algebra.square(b)].flat(Number.POSITIVE_INFINITY)
    }

    static conjugate(o1) {
        if (o1.length === 1) return [`(${o1})`]

        const [a, b] = Algebra.split(o1)

        return [Algebra.conjugate(a), Algebra.negate(b)].flat(Number.POSITIVE_INFINITY)
    }

    static negate(o1) {
        if (o1.length === 1) return [`-(${o1})`]

        const [a, b] = Algebra.split(o1)

        return [Algebra.negate(a), Algebra.negate(b)].flat(Number.POSITIVE_INFINITY)
    }

    static assign(o1, o2, type = '=') {
        if (o1.length === 1) return [`${o1}${type}${o2}`]

        const [a, b, c, d] = Algebra.split(o1, o2)

        return [Algebra.assign(a, c), Algebra.assign(b, d)].flat(Number.POSITIVE_INFINITY)
    }
}
