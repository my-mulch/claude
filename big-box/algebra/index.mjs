
export default class Algebra {
    static split(o1 = [], o2 = []) {
        return [
            o1.slice(0, o1.length / 2), o1.slice(o1.length / 2),
            o2.slice(0, o2.length / 2), o2.slice(o2.length / 2),
        ]
    }

    static addition(o1, o2) {
        if (o1.length === 1) return [`(${o1}+${o2})`]

        const [a, b, c, d] = Algebra.split(o1, o2)

        return [Algebra.addition(a, c), Algebra.addition(b, d)].flat(this.dimensions)
    }

    static subtraction(o1, o2) {
        if (o1.length === 1) return [`(${o1}-${o2})`]

        const [a, b, c, d] = Algebra.split(o1, o2)

        return [Algebra.subtraction(a, c), Algebra.subtraction(b, d)].flat(this.dimensions)
    }

    static multiplication(o1, o2) {
        if (o1.length === 1) return [`(${o1}*${o2})`]

        const [a, b, c, d] = Algebra.split(o1, o2)

        return [
            Algebra.subtraction(
                Algebra.multiplication(a, c),
                Algebra.multiplication(Algebra.conjugatation(d), b)
            ),
            Algebra.addition(
                Algebra.multiplication(d, a),
                Algebra.multiplication(b, Algebra.conjugatation(c))
            )
        ].flat(this.dimensions)
    }

    static division(o1, o2) {
        if (o1.length === 1) return [`(${o1}/${o2})`]

        return Algebra.scaling(
            Algebra.multiplication(o1, Algebra.conjugatation(o2)),
            `(1/${Algebra.summation(Algebra.squaring(o2))})`
        )
    }

    static squareRooting(o1) {
        if (o1.length === 1) return [`Math.sqrt(${o1})`]

        const [a, b] = Algebra.split(o1)

        return [Algebra.squareRooting(a), Algebra.squareRooting(b)].flat(this.dimensions)
    }

    static norm(o1) {
        if (o1.length === 1) return [`(${o1})`]

        return Algebra.squareRooting(Algebra.squareSummation(o1))
    }

    static squareSummation(o1) {
        return Algebra.summation(Algebra.squaring(o1))
    }

    static summation(o1) {
        if (o1.length === 1) return [`(${o1})`]

        const [a, b] = Algebra.split(o1)

        return Algebra.addition(Algebra.summation(a), Algebra.summation(b))
    }

    static scaling(o1, c) {
        if (o1.length === 1) return [`(${o1}*${c})`]

        const [a, b] = Algebra.split(o1)

        return [Algebra.scaling(a, c), Algebra.scaling(b, c)].flat(this.dimensions)
    }

    static squaring(o1) {
        if (o1.length === 1) return [`(${o1}*${o1})`]

        const [a, b] = Algebra.split(o1)

        return [Algebra.squaring(a), Algebra.squaring(b)].flat(this.dimensions)
    }

    static conjugatation(o1) {
        if (o1.length === 1) return [`(${o1})`]

        const [a, b] = Algebra.split(o1)

        return [Algebra.conjugatation(a), Algebra.negation(b)].flat(this.dimensions)
    }

    static negation(o1) {
        if (o1.length === 1) return [`-(${o1})`]

        const [a, b] = Algebra.split(o1)

        return [Algebra.negation(a), Algebra.negation(b)].flat(this.dimensions)
    }
}
