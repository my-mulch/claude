
export default class Cylinder {
    constructor(
        from = [Math.random(), Math.random(), Math.random()],
        to = [Math.random(), Math.random(), Math.random()],

        count = 10,
        radius = 0.01,
        height = 1,
    ) {
        /** Properties */
        this.count = count
        this.height = height
        this.radius = radius
        this.density = Math.PI * 2 / (this.count - 1)

        /** Orientation */
        this.to = to
        this.from = from
        this.up = [0, 1, 0]
        this.model = new Array(16)

        // this.to[0] = this.from[0] + Math.random() * 0.01
        // this.to[1] = this.from[1] + Math.random() * 0.01
        // this.to[2] = this.from[2] + Math.random() * 0.01

        /** Vertices */
        this.vertices = new Float32Array(this.count * 3 * 3 * 2)

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
        for (let i = 0, j = 0; i < v.length; i += 18, j++) {
            /** Top Circle */
            var vt0x = Math.cos((j + 0) * d) * r
            var vt0y = Math.sin((j + 0) * d) * r
            var vt0z = this.height
            var vt0w = 1

            v[i + 0] = m[0] * vt0x + m[4] * vt0y + m[8] * vt0z + m[12] * vt0w
            v[i + 1] = m[1] * vt0x + m[5] * vt0y + m[9] * vt0z + m[13] * vt0w
            v[i + 2] = m[2] * vt0x + m[6] * vt0y + m[10] * vt0z + m[14] * vt0w

            var vt1x = Math.cos((j + 1) * d) * r
            var vt1y = Math.sin((j + 1) * d) * r
            var vt1z = this.height
            var vt1w = 1

            v[i + 3] = m[0] * vt1x + m[4] * vt1y + m[8] * vt1z + m[12] * vt1w
            v[i + 4] = m[1] * vt1x + m[5] * vt1y + m[9] * vt1z + m[13] * vt1w
            v[i + 5] = m[2] * vt1x + m[6] * vt1y + m[10] * vt1z + m[14] * vt1w

            /** Bottom Circle */
            var vb0x = Math.cos((j + 0) * d) * r
            var vb0y = Math.sin((j + 0) * d) * r
            var vb0z = -this.height
            var vb0w = 1

            v[i + 6] = m[0] * vb0x + m[4] * vb0y + m[8] * vb0z + m[12] * vb0w
            v[i + 7] = m[1] * vb0x + m[5] * vb0y + m[9] * vb0z + m[13] * vb0w
            v[i + 8] = m[2] * vb0x + m[6] * vb0y + m[10] * vb0z + m[14] * vb0w

            v[i + 9] = v[i + 6]
            v[i + 10] = v[i + 7]
            v[i + 11] = v[i + 8]

            v[i + 12] = v[i + 3]
            v[i + 13] = v[i + 4]
            v[i + 14] = v[i + 5]


            var vb1x = Math.cos((j + 1) * d) * r
            var vb1y = Math.sin((j + 1) * d) * r
            var vb1z = -this.height
            var vb1w = 1

            v[i + 15] = m[0] * vb1x + m[4] * vb1y + m[8] * vb1z + m[12] * vb1w
            v[i + 16] = m[1] * vb1x + m[5] * vb1y + m[9] * vb1z + m[13] * vb1w
            v[i + 17] = m[2] * vb1x + m[6] * vb1y + m[10] * vb1z + m[14] * vb1w
        }
    }
}
