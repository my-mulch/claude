export const cofactors = function ({ data, r, c }) {
    if (Math.sqrt(data.length) === 1) return data
    if (Math.sqrt(data.length) === 2) return data

    data = survivors({ data, r, c })

    const allCofactors = []
    for (let i = 0; i < Math.sqrt(data.length); i++) {
        const survivorsRC = survivors({ r: 0, c: i, data })
        const cofactorsRC = cofactors({ r, c, data: survivorsRC })

        allCofactors.push(cofactorsRC)
    }

    return allCofactors
}

export const survivors = function ({ data, r, c }) {
    const size = Math.sqrt(data.length)

    return data.filter(function (_, index) {
        if (index % size === c) return false // in column
        if (Math.floor(index / size) === r) return false // in row

        return true
    })
}
