

class CayleyDicksonElement extends Number {
    constructor(...n) {
        super(n)

        this.size = n.reduce(function (size, element) {
            return size + (element.size ? element.size : 1)
        }, 0)

        if (n.length === 1 && this.size === 1) {
            this.a = this
            this.b = 0

            return
        }

        if (n.length === 1 && this.size > 1) {
            this.a = n[0].a
            this.b = n[0].b

            return
        }

        this.a = new CayleyDicksonElement(...n.slice(0, n.length / 2))
        this.b = new CayleyDicksonElement(...n.slice(n.length / 2))
    }

    add(element) {
        if (this.size === 1)
            return new CayleyDicksonElement(this + element)

        return new CayleyDicksonElement(
            this.a.add(element.a),
            this.b.add(element.b),
        )
    }

    subtract(element) {
        if (this.size === 1)
            return new CayleyDicksonElement(this - element)

        return new CayleyDicksonElement(
            this.a.subtract(element.a),
            this.b.subtract(element.b)
        )
    }

    multiply(element) {
        if (this.size === 1)
            return new CayleyDicksonElement(this * element)

        return new CayleyDicksonElement(
            this.a.multiply(element.a).subtract(element.b.conjugate().multiply(this.b)),
            element.b.multiply(this.a).add(this.b.multiply(element.a.conjugate())),
        )
    }

    negate() {
        if (this.size === 1)
            return new CayleyDicksonElement(-this)

        return new CayleyDicksonElement(
            this.a.negate(),
            this.b.negate(),
        )
    }

    conjugate() {
        if (this.size === 1)
            return new CayleyDicksonElement(this)

        return new CayleyDicksonElement(
            this.a.conjugate(),
            this.b.negate(),
        )
    }
}

const real1 = new CayleyDicksonElement(12)
const real2 = new CayleyDicksonElement(15)

console.log(real1.multiply(real2))

const complex1 = new CayleyDicksonElement(12, 7)
const complex2 = new CayleyDicksonElement(15, 13)

console.log(complex1.multiply(complex2))

const quat1 = new CayleyDicksonElement(12, 10, 40, 7)
const quat2 = new CayleyDicksonElement(15, 13, 42, 5)

console.log(quat1.multiply(quat2))


