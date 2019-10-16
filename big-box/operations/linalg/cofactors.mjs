import Algebra from '../../algebra'

export const cofactors = function (indices, array) {
    if (indices.length === 1)
        return Algebra.variable({
            symbol: 'args.of.data',
            size: array.type.size,
            index: array.header.flatIndex(indices[0])
        })

    const allCofactors = []
    const size = Math.sqrt(indices.length)

    for (let i = 0; i < size; i++) {
        const sign = Math.pow(-1, i % 2)
        const cofactor = cofactors(survivors(indices, 0, i), array)
        const factor = Algebra.variable({
            symbol: 'args.of.data',
            size: array.type.size,
            index: array.header.flatIndex(indices[i])
        })

        const product = Algebra.multiply(factor, cofactor)
        allCofactors.push(sign > 0 ? product : Algebra.negate(product))
    }

    return allCofactors.reduce(Algebra.add)
}

export const survivors = function (indices, r, c) {
    const size = Math.sqrt(indices.length)

    return indices.filter(function (_, index) {
        if (index % size === c) return false // in column
        if (Math.floor(index / size) === r) return false // in row

        return true
    })
}

export const template = function (size) {
    const result = []

    for (let r = 0; r < size; r++)
        for (let c = 0; c < size; c++)
            result.push([r, c])

    return result
}
