
class CDE extends Number {
    constructor(...n) {
        super(n)

        this.size = n.length * (n[0].size || 1)

        if (n.length === 1) {
            this.a = n[0].a || this
            this.b = n[0].b || 0
            return
        }

        this.a = new CDE(...n.slice(0, n.length / 2))
        this.b = new CDE(...n.slice(n.length / 2))
    }

    add({ a, b }) {
        if (this.size === 1) return new CDE(this + a)

        return new CDE(this.a.add(a), this.b.add(b))
    }

    subtract({ a, b }) {
        if (this.size === 1) return new CDE(this - a)

        return new CDE(this.a.subtract(a), this.b.subtract(b))
    }

    multiply({ a, b }) {
        if (this.size === 1) return new CDE(this * a)

        return new CDE(
            this.a.multiply(a).subtract(b.conjugate().multiply(this.b)),
            b.multiply(this.a).add(this.b.multiply(a.conjugate())),
        )
    }

    divide(element) {
        return this.multiply(element.conjugate()).scale(1 / element.square().sum())
    }

    negate() {
        if (this.size === 1) return new CDE(-this)

        return new CDE(this.a.negate(), this.b.negate())
    }

    conjugate() {
        if (this.size === 1) return new CDE(this)

        return new CDE(this.a.conjugate(), this.b.negate())
    }

    scale(scalar) {
        if(this.size === 1) return new CDE(this * scalar)

        return new CDE(this.a.scale(scalar), this.b.scale(scalar))
    }

    square() {
        if (this.size === 1) return new CDE(this * this)

        return new CDE(this.a.square(), this.b.square())
    }

    sum() {
        if (this.size === 1) return new CDE(this)

        return this.a.sum().add(this.b.sum())
    }

    norm() {
        return Math.sqrt(this.square().sum())
    }

    toString() {
        if (this.size === 1) return this + 0

        return [this.a.toString(), this.b.toString()].flat(Number.POSITIVE_INFINITY)
    }
}

const real1 = new CDE(12)
const real2 = new CDE(15)

console.log(real1.divide(real2).toString())

const complex1 = new CDE(12, 7)
const complex2 = new CDE(15, 13)

console.log(complex1.divide(complex2).toString())

const quat1 = new CDE(12, 10, 40, 7)
const quat2 = new CDE(15, 13, 42, 5)

console.log(quat1.divide(quat2).toString())

const oct1 = new CDE(2, 3, 1, 2, 4, 3, 4, 2)
const oct2 = new CDE(2, 3, 1, 2, 4, 3, 4, 2)

console.log(oct1.divide(oct2).toString())

const sed1 = new CDE(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53)
const sed2 = new CDE(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53)

console.log(sed1.divide(sed2).toString())
