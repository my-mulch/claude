import Frame from './utils.mjs'

export default class Circle {
    constructor(
        count = 20,
        radius = 0.1,

        up = [0, 1, 0],
        to = [Math.random(), Math.random(), Math.random()],
        from = [Math.random(), Math.random(), Math.random()],
    ) {
        /** Properties */
        this.count = count
        this.radius = radius
        this.density = Math.PI * 2 / (this.count - 1)

        /** Orientation */
        this.up = new Float32Array(up)
        this.to = new Float32Array(to)
        this.from = new Float32Array(from)
        this.model = new Float32Array(16)

        /** Vertices */
        this.vertices = new Float32Array(this.count * 3 * 3)

        /** Dummy Variables */
        const t = this.to
        const u = this.up
        const f = this.from
        const m = this.model
        const r = this.radius
        const d = this.density
        const v = this.vertices

        /** Orientation */
        Frame.init(t, u, f, m)

        /** Populate */
        for (let i = 0, j = 0; i < v.length; i += 9, j++) {
            const v0x = Math.cos((j + 0) * d) * r
            const v0y = Math.sin((j + 0) * d) * r
            const v0z = 0
            const v0w = 1

            v[i + 0] = m[0] * v0x + m[4] * v0y + m[8] * v0z + m[12] * v0w
            v[i + 1] = m[1] * v0x + m[5] * v0y + m[9] * v0z + m[13] * v0w
            v[i + 2] = m[2] * v0x + m[6] * v0y + m[10] * v0z + m[14] * v0w

            const v1x = Math.cos((j + 1) * d) * r
            const v1y = Math.sin((j + 1) * d) * r
            const v1z = 0
            const v1w = 1

            v[i + 3] = m[0] * v1x + m[4] * v1y + m[8] * v1z + m[12] * v1w
            v[i + 4] = m[1] * v1x + m[5] * v1y + m[9] * v1z + m[13] * v1w
            v[i + 5] = m[2] * v1x + m[6] * v1y + m[10] * v1z + m[14] * v1w

            const v2x = t[0]
            const v2y = t[1]
            const v2z = t[2]

            v[i + 6] = v2x
            v[i + 7] = v2y
            v[i + 8] = v2z
        }
    }
}

