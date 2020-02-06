
export default class Shape {
    static count = 25
    static density = Math.PI * 2 / (Shape.count - 1)

    constructor(to = [1, 0, 0], from = [0, 0, 0], up = [0, 1.0000000001, 0]) {
        /** Orientation */
        this.to = to
        this.up = up
        this.from = from

        /** Define Forward-Facing */
        let fx = this.to[0] - this.from[0]
        let fy = this.to[1] - this.from[1]
        let fz = this.to[2] - this.from[2]

        /** Normalize Forward-Facing */
        const fn = 1 / Math.sqrt(fx * fx + fy * fy + fz * fz)

        fx *= fn
        fy *= fn
        fz *= fn

        /** Calculate Cross Product of Up and Forward */
        let sx = this.up[1] * fz - this.up[2] * fy
        let sy = this.up[2] * fx - this.up[0] * fz
        let sz = this.up[0] * fy - this.up[1] * fx

        /** Normalize Side-Facing */
        const sn = 1 / Math.sqrt(sx * sx + sy * sy + sz * sz)

        sx *= sn
        sy *= sn
        sz *= sn

        /** Calculate Cross Product of Forward and Side */
        const ux = fy * sz - fz * sy
        const uy = fz * sx - fx * sz
        const uz = fx * sy - fy * sx

        this.frame = [sx, sy, sz, ux, uy, uz, fx, fy, fz]
    }
} 
