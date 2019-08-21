
export const cofactorHelper = function cofactorHelper(A) {
    const size = Math.round(Math.sqrt(A.length))

    if (size === 1)
        return null


    if (size === 2) {
        const a0 = indexify.call(this, A[0])
        const a1 = indexify.call(this, A[1])
        const a2 = indexify.call(this, A[2])
        const a3 = indexify.call(this, A[3])

        return null
    }

    const cofactors = []
    for (let i = 0; i < size; i++) {
        cofactors.push([
            cofactorHelper.call(this, survivors(A, 0, i)),
        ].join('\n'))
    }

    return [
        ...cofactors
    ].join('\n')
}

export const indexify = function (r, c) {
    if (c === undefined)
        [r, c] = flatToRC.call(this, r)

    return this.offset
        + r * this.strides[0]
        + c * this.strides[1]
}

const flatToRC = function (index) {
    const s0 = this.shape[0], s1 = 1

    return [
        Math.floor(index / s0) % this.shape[0],
        Math.floor(index / s1) % this.shape[1],
    ]
}

export const survivors = function (A, r, c) {
    const size = Math.round(Math.sqrt(A.length))

    return A.filter(function (_, index) {
        if (index % size === c) return false // in column
        if (Math.floor(index / size) === r) return false // in row

        return true
    })
}

export const symIndex = function ({ arrayName, indices }) {
    return `${arrayName}.offset + 
                ${indices[0]} * ${arrayName}.strides[0] + 
                ${indices[1]} * ${arrayName}.strides[1]`
}
