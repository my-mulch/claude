
class CaleyDicksonElement {
    constructor(a, b) {
        this.a = a
        this.b = b
    }

    add(c, d) {
        return new CaleyDicksonElement(
            this.a.map(function (a, i) { return a + c[i] }),
            this.b.map(function (b, i) { return b + d[i] }),
        )
    }
}

class CaleyDicksonAlgebra {
    static addition(a, b, c, d) {
        return new CaleyDicksonElement(
            a.add(c),
            b.add(d)
        )
    }

    static subtraction(a, b, c, d) {
        return new CaleyDicksonElement(
            a.subtract(c),
            b.subtract(d)
        )
    }

    static multiplication(a, b, c, d) {
        return new CaleyDicksonElement(
            a.multiply(c).subtract(d.conjugate().multiply(b)),
            d.multiply(a).add(b.multiply(c.conjugate()))
        )
    }

    static division(a, b, c, d) {
        const modulus = c.conjugate().multiply(c).add(d.conjugate().multiply(d))

        return new CaleyDicksonElement(
            a.multiply(c.conjugate().add(d.conjugate().multiply(b))),
            b.multiply(c).subtract(d.multiply(a))
        ).scale(1 / modulus)
    }

    static conjugation() {
        return new CaleyDicksonElement(
            a.conjugate(),
            b.negate()
        )
    }

    static negation() {
        return new CaleyDicksonElement(
            a.negate(),
            b.negate()
        )
    }

    static scalarMultiplication(lambda) {
        return new CaleyDicksonElement(
            a.scale(lambda),
            b.scale(lambda)
        )
    }
}

const quat1 = new CaleyDicksonElement([12, 10], [40, 7])
const quat2 = new CaleyDicksonElement([15, 13], [42, 5])

CaleyDicksonAlgebra.addition()
