import Shape from './interface.js'

export default class Cone extends Shape {
    constructor(
        to = [1, 0, 0],
        from = [0, 0, 0],
        radius = 0.1,
    ) {
        /** Constructor */
        super(to, from)
        
        /** Properties */
        this.radius = radius
        this.vertices = new Float32Array(Shape.count * 3 * 3)

        /** Orientation */
        const [sx, sy, sz, ux, uy, uz] = this.frame

        /** Populate */
        for (let i = 0, j = 0; i < this.vertices.length; i += 9, j++) {
            const v0x = Math.cos((j + 0) * Shape.density) * this.radius
            const v0y = Math.sin((j + 0) * Shape.density) * this.radius

            this.vertices[i + 0] = sx * v0x + ux * v0y + this.from[0]
            this.vertices[i + 1] = sy * v0x + uy * v0y + this.from[1]
            this.vertices[i + 2] = sz * v0x + uz * v0y + this.from[2]

            const v1x = Math.cos((j + 1) * Shape.density) * this.radius
            const v1y = Math.sin((j + 1) * Shape.density) * this.radius

            this.vertices[i + 3] = sx * v1x + ux * v1y + this.from[0]
            this.vertices[i + 4] = sy * v1x + uy * v1y + this.from[1]
            this.vertices[i + 5] = sz * v1x + uz * v1y + this.from[2]

            this.vertices[i + 6] = this.to[0]
            this.vertices[i + 7] = this.to[1]
            this.vertices[i + 8] = this.to[2]
        }
    }
}
