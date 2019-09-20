
export default class Element extends String {
    constructor(...n) {
        super(n)

        this.size = n.length * (n[0].size || 1)

        if (n.length === 1) {
            this.a = n[0].a || this
            this.b = n[0].b || 0
            return
        }

        this.a = new Element(...n.slice(0, n.length / 2))
        this.b = new Element(...n.slice(n.length / 2))
    }

    add({ a, b }) {
        if (this.size === 1)
            return new Element(`(${this} + ${a})`)

        return new Element(this.a.add(a), this.b.add(b))
    }

    subtract({ a, b }) {
        if (this.size === 1)
            return new Element(`(${this} - ${a})`)

        return new Element(this.a.subtract(a), this.b.subtract(b))
    }

    multiply({ a, b }) {
        if (this.size === 1)
            return new Element(`(${this} * ${a})`)

        return new Element(
            this.a.multiply(a).subtract(b.conjugate().multiply(this.b)),
            b.multiply(this.a).add(this.b.multiply(a.conjugate())),
        )
    }

    divide(element) {
        return this.multiply(element.conjugate()).scale(`(1 / ${element.square().sum()})`)
    }

    negate() {
        if (this.size === 1)
            return new Element(`-(${this})`)

        return new Element(this.a.negate(), this.b.negate())
    }

    conjugate() {
        if (this.size === 1)
            return new Element(`${this}`)

        return new Element(this.a.conjugate(), this.b.negate())
    }

    scale(scalar) {
        if (this.size === 1) return new Element(`(${this} * ${scalar})`)

        return new Element(this.a.scale(scalar), this.b.scale(scalar))
    }

    square() {
        if (this.size === 1)
            return new Element(`(${this} * ${this})`)

        return new Element(this.a.square(), this.b.square())
    }

    sum() {
        if (this.size === 1)
            return new Element(`${this}`)

        return this.a.sum().add(this.b.sum())
    }

    norm() {
        return Math.sqrt(this.square().sum())
    }

    assign() {
        if (this.size === 1)
            return new Element(`${this}`)

        return new Element(this.a.assign(), this.b.assign())
    }

    display() {
        if (this.size === 1) {
            const value = Number(this)
            const sign = Math.sign(value) < 0 ? '-' : '+'

            return new Element(`${sign}${Math.abs(value)}`)
        }

        return [this.a.display(), this.b.display()].toString().split(',').join('')
    }
}

const a = new Element('a', 'b')
const b = new Element('c', 'd')

console.log(a.multiply(b).toString().split(','))
