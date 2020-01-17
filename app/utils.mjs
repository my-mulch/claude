
export const frame = function (fromPoint, toPoint, upPoint, frontFrame, sideFrame, upFrame) {
    /** Dummy Variables */
    const up = upPoint
    const tp = toPoint
    const fp = fromPoint

    const uf = upFrame
    const sf = sideFrame
    const ff = frontFrame
    
    /** Define Forward-Facing, then Normalize */
    ff[0] = fp[0] - tp[0]
    ff[1] = fp[1] - tp[1]
    ff[2] = fp[2] - tp[2]

    normalize(ff)

    /** Cross Up-Point and Forward-Facing for Side-Facing, then Normalize */
    normalize(cross(up, ff, sf))

    /** Cross Forward-Facing and Side-Facing for Up-Facing */
    cross(ff, sf, uf)
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
    const inverseNorm = 1 / norm(vector)

    vector[0] *= inverseNorm
    vector[1] *= inverseNorm
    vector[2] *= inverseNorm

    return vector
}

export const transposeMat3ByVec3 = function (matrix, vector) {
    /** Dummy Variables */
    const m = matrix
    const v = vector

    const rx = m[0] * v[0] + m[1] * v[1] + m[2] * v[2]
    const ry = m[4] * v[0] + m[5] * v[1] + m[6] * v[2]
    const rz = m[8] * v[0] + m[9] * v[1] + m[10] * v[2]

    vector[0] = rx
    vector[1] = ry
    vector[2] = rz

    return vector
}

export const quatMult = function (q, o, r) {
    r[0] = q[0] * o[0] - q[1] * o[1] - q[2] * o[2] - q[3] * o[3]
    r[1] = q[1] * o[0] + q[0] * o[1] + q[2] * o[3] - q[3] * o[2]
    r[2] = q[0] * o[2] - q[1] * o[3] + q[2] * o[0] + q[3] * o[1]
    r[3] = q[0] * o[3] + q[1] * o[2] - q[2] * o[1] + q[3] * o[0]
}

export const quatToRotation = function (quat, model) {
    /** Dummy Variables */
    const r = quat
    const m = model

    m[0] = 1 - 2 * r[2] * r[2] - 2 * r[3] * r[3]
    m[1] = 2 * r[1] * r[2] + 2 * r[3] * r[0]
    m[2] = 2 * r[1] * r[3] - 2 * r[2] * r[0]
    m[3] = 0

    m[4] = 2 * r[1] * r[2] - 2 * r[3] * r[0]
    m[5] = 1 - 2 * r[1] * r[1] - 2 * r[3] * r[3]
    m[6] = 2 * r[2] * r[3] + 2 * r[1] * r[0]
    m[7] = 0

    m[8] = 2 * r[1] * r[3] + 2 * r[2] * r[0]
    m[9] = 2 * r[2] * r[3] - 2 * r[1] * r[0]
    m[10] = 1 - 2 * r[1] * r[1] - 2 * r[2] * r[2]
    m[11] = 0

    m[12] = 0
    m[13] = 0
    m[14] = 0
    m[15] = 1

    return model
}

export const dot = function (v, w) {
    return v[0] * w[0] + v[1] * w[1] + v[2] * w[2]
}

export const norm = function (vector) {
    return Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2)
}

