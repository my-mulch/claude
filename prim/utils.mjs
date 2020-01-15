
export default class Frame {
    static init(to, up, from, model) {
        /** Dummy Variables */
        const t = to
        const u = up
        const f = from
        const m = model

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
    }
}
