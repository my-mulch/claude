import Cone from './cone.js'
import Cylinder from './cylinder.js'

export default class Vector {
    constructor({
        to = [1, 0, 0],
        from = [0, 0, 0],
        radius = 0.1,
    }) {
        /** Description */
        this.to = to
        this.from = from
        this.radius = radius

        /** Components */
        this.base = new Cylinder({
            to: [
                this.to[0] * 0.92,
                this.to[1] * 0.92,
                this.to[2] * 0.92
            ],
            from
        })

        this.tip = new Cone({
            to: this.to,
            from: this.base.to,
        })

        /** Vertices */
        this.vertices = new Float32Array(this.base.length + this.tip.length)
        this.vertices.set(this.base)
        this.vertices.set(this.tip, this.base.length)
    }
}
