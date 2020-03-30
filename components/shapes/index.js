
export default class Shape extends Float32Array {
    constructor({
        type,
        to = [1, 0, 0],
        from = [0, 0, 0],
        up = [Math.random() / 10, 1, Math.random() / 10],
    }) {
        /** Super */
        super(type.size)

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
