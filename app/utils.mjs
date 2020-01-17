
export const frame = function (fp, tp, up, ff, sf, uf, model) {
    /** Dummy Variables */
    const m = model

    /** Define Forward-Facing, then Normalize */
    ff[0] = fp[0] - tp[0]
    ff[1] = fp[1] - tp[1]
    ff[2] = fp[2] - tp[2]

    normalize(ff)

    /** Cross Up-Point and Forward-Facing for Side-Facing, then Normalize */
    normalize(cross(up, ff, sf))

    /** Cross Forward-Facing and Side-Facing for Up-Facing */
    cross(ff, sf, uf)

    /** Create Frame from Vectors */
    m[0] = sf[0]; m[4] = uf[0]; m[8] = ff[0]; m[12] = 0
    m[1] = sf[1]; m[5] = uf[1]; m[9] = ff[1]; m[13] = 0
    m[2] = sf[2]; m[6] = uf[2]; m[10] = ff[2]; m[14] = 0
    m[3] = 0; m[7] = 0; m[11] = 0; m[15] = 1

    return m
}

export const cross = function (v, w, r) {
    const rx = v[1] * w[2] - v[2] * w[1]
    const ry = v[2] * w[0] - v[0] * w[2]
    const rz = v[0] * w[1] - v[1] * w[0]

    r[0] = rx
    r[1] = ry
    r[2] = rz

    return r
}

export const transpose = function (model) {
    /** Dummy Variables */
    let t
    const m = model

    t = m[1]; m[1] = m[4]; m[4] = t
    t = m[2]; m[2] = m[8]; m[8] = t
    t = m[3]; m[3] = m[12]; m[12] = t
    t = m[6]; m[6] = m[9]; m[9] = t
    t = m[7]; m[7] = m[13]; m[13] = t
    t = m[11]; m[11] = m[14]; m[14] = t

    return m
}

export const translate = function (x, y, z, model) {
    /** Dummy Variables */
    const m = model

    /** Matrix Multiplication by Translate Matrix from the Right */
    m[12] += m[0] * x + m[4] * y + m[8] * z
    m[13] += m[1] * x + m[5] * y + m[9] * z
    m[14] += m[2] * x + m[6] * y + m[10] * z
    m[15] += m[3] * x + m[7] * y + m[11] * z

    return m
}

export const normalize = function (vector) {
    const inverseNorm = 1 / Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2)

    vector[0] *= inverseNorm
    vector[1] *= inverseNorm
    vector[2] *= inverseNorm

    return vector
}

export const transposeMat3ByVec3 = function (matrix, vector) {
    /** Dummy Variables */
    const m = model
    const v = vector

    const rx = m[0] * v[0] + m[1] * v[1] + m[2] * v[2]
    const ry = m[4] * v[0] + m[5] * v[1] + m[6] * v[2]
    const rz = m[8] * v[0] + m[9] * v[1] + m[10] * v[2]

    vector[0] = rx
    vector[1] = ry
    vector[2] = rz

    return vector
}

export const matrixByVector = function (x, y, z, w, model) {
    /** Dummy Variables */
    const m = model

    return [
        m[0] * x + m[4] * y + m[8] * z + m[12] * w,
        m[1] * x + m[5] * y + m[9] * z + m[13] * w,
        m[2] * x + m[6] * y + m[10] * z + m[14] * w,
        m[3] * x + m[7] * y + m[11] * z + m[15] * w
    ]
}

const m = frame([5, 5, 5], [0, 0, 0], [0, 1, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], new Float32Array(16))

transpose(m)

translate(-5, -5, -5, m)

console.log(m)
