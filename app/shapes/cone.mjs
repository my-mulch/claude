
export default class Cone {
    constructor(
        count = 10,
        radius = 0.01,

        up = [0, 1, 0],
        to = [0, 0, 0],
        from = [0, 0, 1],
    ) {
        /** Properties */
        this.count = count
        this.radius = radius
        this.density = Math.PI * 2 / (this.count - 1)

        /** Orientation */
        this.up = up
        this.to = to
        this.from = from

        /** Vertices */
        this.vertices = new Array(this.count * 3 * 3)

        /** Dummy Variables */
        const t = this.to
        const u = this.up
        const f = this.from
        const r = this.radius
        const d = this.density
        const v = this.vertices

        /** Populate */
        for (let i = 0, j = 0; i < v.length; i += 9, j++) {
            const v0x = Math.cos((j + 0) * d) * r
            const v0y = Math.sin((j + 0) * d) * r
            const v0z = 0

            v[i + 0] = sx * v0x + ux * v0y + fx * v0z + f[0]
            v[i + 1] = sy * v0x + uy * v0y + fy * v0z + f[1]
            v[i + 2] = sz * v0x + uz * v0y + fz * v0z + f[2]

            const v1x = Math.cos((j + 1) * d) * r
            const v1y = Math.sin((j + 1) * d) * r
            const v1z = 0

            v[i + 3] = sx * v1x + ux * v1y + fx * v1z + f[0]
            v[i + 4] = sy * v1x + uy * v1y + fy * v1z + f[1]
            v[i + 5] = sz * v1x + uz * v1y + fz * v1z + f[2]

            v[i + 6] = t[0]
            v[i + 7] = t[1]
            v[i + 8] = t[2]
        }
    }
}
