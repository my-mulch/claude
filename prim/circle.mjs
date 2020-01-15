
export default class Circle {
    constructor(
        count = 20,
        radius = 1,
        origin = [0, 0, 0],
        direction = [0, 0, 1]
    ) {
        /** Properties */
        this.count = count
        this.radius = radius
        this.density = Math.PI * 2 / (this.count - 1)

        /** Orientation */
        this.origin = origin
        this.direction = direction

        /** Vertices */
        this.vertices = new Float32Array(this.count * 3 * 3)

        /** Dummy Variables */
        const o = this.origin
        const r = this.radius
        const d = this.density
        const v = this.vertices

        for (let i = 0, j = 0; i < v.length; i += 9, j++) {
            v[i + 0] = Math.cos((j + 0) * d) * r + o[0]
            v[i + 1] = Math.sin((j + 0) * d) * r + o[1]
            v[i + 2] = o[2]

            v[i + 3] = Math.cos((j + 1) * d) * r + o[0]
            v[i + 4] = Math.sin((j + 1) * d) * r + o[1]
            v[i + 5] = o[2]

            v[i + 6] = o[0]
            v[i + 7] = o[1]
            v[i + 8] = o[2]
        }
    }
}

