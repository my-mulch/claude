
export default class Cone {
    constructor(
        count = 7,
        radius = 0.001,

        up = [0, 1, 0],
        to = [Math.random(), Math.random(), Math.random()],
        from = [Math.random(), Math.random(), Math.random()],
    ) {
        /** Properties */
        this.count = count
        this.radius = radius
        this.density = Math.PI * 2 / (this.count - 1)

        /** Orientation */
        this.up = up
        this.to = to
        this.from = from
        this.model = new Array(16)

        this.to[0] = this.from[0] + Math.random() * 0.01
        this.to[1] = this.from[1] + Math.random() * 0.01
        this.to[2] = this.from[2] + Math.random() * 0.01

        /** Vertices */
        this.vertices = new Array(this.count * 3 * 3)

        /** Dummy Variables */
        const t = this.to
        const u = this.up
        const f = this.from
        const m = this.model
        const r = this.radius
        const d = this.density
        const v = this.vertices

        /** Define Forward-Facing */
        let fx = t[0] - f[0]
        let fy = t[1] - f[1]
        let fz = t[2] - f[2]

        /** Normalize Forward-Facing */
        const fn = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz)

        fx *= fn
        fy *= fn
        fz *= fn

        /** Calculate Cross Product of Up and Forward */
        let sx = u[1] * fz - u[2] * fy
        let sy = u[2] * fx - u[0] * fz
        let sz = u[0] * fy - u[1] * fx

        /** Normalize Side-Facing */
        const sn = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz)

        sx *= sn
        sy *= sn
        sz *= sn

        /** Calculate Cross Product of Forward and Side */
        const ux = fy * sz - fz * sy
        const uy = fz * sx - fx * sz
        const uz = fx * sy - fy * sx

        /** Assign Rotation to Look Matrix */
        m[0] = sx; m[4] = ux; m[8] = fx; m[12] = f[0]
        m[1] = sy; m[5] = uy; m[9] = fy; m[13] = f[1]
        m[2] = sz; m[6] = uz; m[10] = fz; m[14] = f[2]
        m[15] = 1

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
