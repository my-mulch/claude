
export default class Algebra {
    constructor({ dimensions, prefix = '' }) {
        this.prefix = prefix
        this.dimensions = dimensions
        this.precisions = {}

        /** Elements */
        this.o1 = new Array(this.dimensions).fill(null).map(this.__of__)
        this.o2 = new Array(this.dimensions).fill(null).map(this.__with__)

        /** Operations */
        this.neg = this.__format__(Algebra.negation(this.o1, this.o2))
        this.cnj = this.__format__(Algebra.conjugatation(this.o1, this.o2))

        this.add = this.__format__(Algebra.addition(this.o1, this.o2))
        this.sub = this.__format__(Algebra.subtraction(this.o1, this.o2))
        this.mul = this.__format__(Algebra.multiplication(this.o1, this.o2))

        this.mac = this.__format__(Algebra.multiplication(this.o1, this.o2), '+=')
    }

    __of__(_, dimension) { return `this.of.data[ofIndex+${dimension}]` }
    __with__(_, dimension) { return `this.with.data[withIndex+${dimension}]` }

    __result__(assignmentType) {
        return function (value, dimension) {
            return `this.result.data[resultIndex+${dimension}]${assignmentType}${value}`
        }
    }

    __format__(operation, assignmentType = '=') {
        return new Function('{oi,wi,ri}', `return "${
            operation
                .map(this.__result__(assignmentType))
                .join(';')}"
            .replace(/ofIndex/g, oi)
            .replace(/withIndex/g, wi)
            .replace(/resultIndex/g, ri)`)
    }

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
