import Shape from './index.js'

export default class Cone extends Shape {
    static count = 25
    static size = Cone.count * 3 * 3 * 2
    static density = Math.PI * 2 / (Cone.count - 1)

    constructor({
        to = [1, 0, 0],
        from = [0, 0, 0],
        radius = 0.1,
    }) {
        /** Constructor */
        super({ type: Cone, to, from })

        /** Properties */
        this.radius = radius

        /** Orientation */
        const [sx, sy, sz, ux, uy, uz] = this.frame


        /** Populate */
        for (let i = 0, j = 0; i < this.length; i += 9, j++) {
            const v0x = Math.cos((j + 0) * Cone.density) * this.radius
            const v0y = Math.sin((j + 0) * Cone.density) * this.radius

            this[i + 0] = sx * v0x + ux * v0y + this.from[0]
            this[i + 1] = sy * v0x + uy * v0y + this.from[1]
            this[i + 2] = sz * v0x + uz * v0y + this.from[2]

            const v1x = Math.cos((j + 1) * Cone.density) * this.radius
            const v1y = Math.sin((j + 1) * Cone.density) * this.radius

            this[i + 3] = sx * v1x + ux * v1y + this.from[0]
            this[i + 4] = sy * v1x + uy * v1y + this.from[1]
            this[i + 5] = sz * v1x + uz * v1y + this.from[2]

            this[i + 6] = this.to[0]
            this[i + 7] = this.to[1]
            this[i + 8] = this.to[2]
        }
    }
}
