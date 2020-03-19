import Shape from './interface.js'

export default class Cylinder extends Shape {
    constructor(
        to = [1, 0, 0],
        from = [0, 0, 0],
        radius = 0.1,
        height = 0.1,
    ) {
        /** Constructor */
        super(to, from)

        /** Properties */
        this.radius = radius
        this.height = height
        this.vertices = new Float32Array(Shape.count * 3 * 3 * 2)

        /** Orientation */
        const [sx, sy, sz, ux, uy, uz, fx, fy, fz] = this.frame

        /** Populate */
        for (let i = 0, j = 0; i < this.vertices.length; i += 18, j++) {
            /** Top Circle */
            var vt0x = Math.cos((j + 0) * Shape.density) * this.radius
            var vt0y = Math.sin((j + 0) * Shape.density) * this.radius
            var vt0z = this.height

            this.vertices[i + 0] = sx * vt0x + ux * vt0y + fx * vt0z + this.from[0]
            this.vertices[i + 1] = sy * vt0x + uy * vt0y + fy * vt0z + this.from[1]
            this.vertices[i + 2] = sz * vt0x + uz * vt0y + fz * vt0z + this.from[2]

            var vt1x = Math.cos((j + 1) * Shape.density) * this.radius
            var vt1y = Math.sin((j + 1) * Shape.density) * this.radius
            var vt1z = this.height

            this.vertices[i + 3] = sx * vt1x + ux * vt1y + fx * vt1z + this.from[0]
            this.vertices[i + 4] = sy * vt1x + uy * vt1y + fy * vt1z + this.from[1]
            this.vertices[i + 5] = sz * vt1x + uz * vt1y + fz * vt1z + this.from[2]

            /** Bottom Circle */
            var vb0x = Math.cos((j + 0) * Shape.density) * this.radius
            var vb0y = Math.sin((j + 0) * Shape.density) * this.radius

            this.vertices[i + 6] = sx * vb0x + ux * vb0y + this.from[0]
            this.vertices[i + 7] = sy * vb0x + uy * vb0y + this.from[1]
            this.vertices[i + 8] = sz * vb0x + uz * vb0y + this.from[2]

            this.vertices[i + 9] = this.vertices[i + 6]
            this.vertices[i + 10] = this.vertices[i + 7]
            this.vertices[i + 11] = this.vertices[i + 8]

            this.vertices[i + 12] = this.vertices[i + 3]
            this.vertices[i + 13] = this.vertices[i + 4]
            this.vertices[i + 14] = this.vertices[i + 5]

            var vb1x = Math.cos((j + 1) * Shape.density) * this.radius
            var vb1y = Math.sin((j + 1) * Shape.density) * this.radius

            this.vertices[i + 15] = sx * vb1x + ux * vb1y + this.from[0]
            this.vertices[i + 16] = sy * vb1x + uy * vb1y + this.from[1]
            this.vertices[i + 17] = sz * vb1x + uz * vb1y + this.from[2]
        }
    }
}
