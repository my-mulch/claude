import Shape from './index.js'

export default class Cylinder extends Shape {
    static count = 25
    static size = Cylinder.count * 3 * 3 * 2
    static density = Math.PI * 2 / (Cylinder.count - 1)

    constructor({
        to = [1, 0, 0],
        from = [0, 0, 0],
        radius = 0.03,
        height = 0.1,
    }) {
        /** Constructor */
        super({ type: Cylinder, to, from })

        /** Properties */
        this.radius = radius
        this.height = Math.sqrt(
            (this.to[0] - this.from[0]) ** 2 +
            (this.to[1] - this.from[1]) ** 2 +
            (this.to[2] - this.from[2]) ** 2
        )

        /** Orientation */
        const [sx, sy, sz, ux, uy, uz, fx, fy, fz] = this.frame

        /** Populate */
        for (let i = 0, j = 0; i < this.length; i += 18, j++) {
            /** Top Circle */
            var vt0x = Math.cos((j + 0) * Cylinder.density) * this.radius
            var vt0y = Math.sin((j + 0) * Cylinder.density) * this.radius
            var vt0z = this.height

            this[i + 0] = sx * vt0x + ux * vt0y + fx * vt0z + this.from[0]
            this[i + 1] = sy * vt0x + uy * vt0y + fy * vt0z + this.from[1]
            this[i + 2] = sz * vt0x + uz * vt0y + fz * vt0z + this.from[2]

            var vt1x = Math.cos((j + 1) * Cylinder.density) * this.radius
            var vt1y = Math.sin((j + 1) * Cylinder.density) * this.radius
            var vt1z = this.height

            this[i + 3] = sx * vt1x + ux * vt1y + fx * vt1z + this.from[0]
            this[i + 4] = sy * vt1x + uy * vt1y + fy * vt1z + this.from[1]
            this[i + 5] = sz * vt1x + uz * vt1y + fz * vt1z + this.from[2]

            /** Bottom Circle */
            var vb0x = Math.cos((j + 0) * Cylinder.density) * this.radius
            var vb0y = Math.sin((j + 0) * Cylinder.density) * this.radius

            this[i + 6] = sx * vb0x + ux * vb0y + this.from[0]
            this[i + 7] = sy * vb0x + uy * vb0y + this.from[1]
            this[i + 8] = sz * vb0x + uz * vb0y + this.from[2]

            this[i + 9] = this[i + 6]
            this[i + 10] = this[i + 7]
            this[i + 11] = this[i + 8]

            this[i + 12] = this[i + 3]
            this[i + 13] = this[i + 4]
            this[i + 14] = this[i + 5]

            var vb1x = Math.cos((j + 1) * Cylinder.density) * this.radius
            var vb1y = Math.sin((j + 1) * Cylinder.density) * this.radius

            this[i + 15] = sx * vb1x + ux * vb1y + this.from[0]
            this[i + 16] = sy * vb1x + uy * vb1y + this.from[1]
            this[i + 17] = sz * vb1x + uz * vb1y + this.from[2]
        }
    }
}
