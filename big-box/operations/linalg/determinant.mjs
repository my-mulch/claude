
export default class Determinant {
    create(A, B, R) { return this.pointwise(A, B, R) }
    resultant(A) { return { shape: [1], type: A.type.size } }

    pointwise(A, B, R, matrix = Determinant.template(A.shape[0])) {
        if (matrix.length === 1)
            return Algebra.variable({
                symbol: 'A.data',
                size: A.type.size,
                index: A.header.flatIndex(matrix[0])
            })

        const subDeterminants = []
        const size = Math.sqrt(matrix.length)

        for (let i = 0; i < size; i++) {
            const minor = Determinant.minor(matrix, 0, i)
            const subDeterminant = this.pointwise(A, B, R, minor)

            const factor = Algebra.variable({
                symbol: 'A.data',
                size: A.type.size,
                index: A.header.flatIndex(matrix[i])
            })

            const cofactor = Algebra.multiply(factor, subDeterminant)

            subDeterminants.push(Math.pow(-1, i % 2) > 0 ? cofactor : Algebra.negate(cofactor))
        }

        return subDeterminants.reduce(Algebra.add)
    }

    static minor(matrix, r, c) {
        const size = Math.sqrt(matrix.length)

        return matrix.filter(function (_, index) {
            if (index % size === c) return false // in column
            if (Math.floor(index / size) === r) return false // in row

            return true
        })
    }

    static template(size) {
        const result = []

        for (let r = 0; r < size; r++)
            for (let c = 0; c < size; c++)
                result.push([r, c])

        return result
    }
}
