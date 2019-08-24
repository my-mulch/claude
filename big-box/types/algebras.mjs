
class CDE extends Number {
    constructor(...n) {
        super(n)

        this.size = n.length * (n[0].size || 1)

        if (n.length === 1) {
            this.a = n[0].a || null
            this.b = n[0].b || null
            return
        }

        this.a = new CDE(...n.slice(0, n.length / 2))
        this.b = new CDE(...n.slice(n.length / 2))
    }

    add(element) {
        if (this.size === 1) return new CDE(this + element)

        return new CDE(this.a.add(element.a), this.b.add(element.b))
    }

    subtract(element) {
        if (this.size === 1) return new CDE(this - element)

        return new CDE(this.a.subtract(element.a), this.b.subtract(element.b))
    }

    multiply(element) {
        if (this.size === 1) return new CDE(this * element)

        return new CDE(
            this.a.multiply(element.a).subtract(element.b.conjugate().multiply(this.b)),
            element.b.multiply(this.a).add(this.b.multiply(element.a.conjugate())),
        )
    }

    negate() {
        if (this.size === 1) return new CDE(-this)

        return new CDE(this.a.negate(), this.b.negate())
    }

    conjugate() {
        if (this.size === 1) return new CDE(this)

        return new CDE(this.a.conjugate(), this.b.negate())
    }

    toString() {
        if (this.size === 1) return this + 0

        return [this.a.toString(), this.b.toString()].flat(Number.POSITIVE_INFINITY)
    }
}

const real1 = new CDE(12)
const real2 = new CDE(15)

console.log(real1.multiply(real2).toString())

const complex1 = new CDE(12, 7)
const complex2 = new CDE(15, 13)

console.log(complex1.multiply(complex2).toString())

const quat1 = new CDE(12, 10, 40, 7)
const quat2 = new CDE(15, 13, 42, 5)

console.log(quat1.multiply(quat2).toString())

const oct1 = new CDE(2, 3, 1, 2, 4, 3, 4, 2)
const oct2 = new CDE(2, 3, 1, 2, 4, 3, 4, 2)

console.log(oct1.multiply(oct2).toString())

const sed1 = new CDE(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53)
const sed2 = new CDE(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53)

console.log(sed1.multiply(sed2).toString())
