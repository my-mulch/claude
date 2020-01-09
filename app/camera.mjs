
export default class Camera {
    constructor(
        /** Viewing */
        aspect = 1,
        angle = 30,
        near = 1e-6,
        far = 1e6,

        /** Positioning */
        up = [0, 1, 0],
        to = [0, 0, 0],
        from = [0, 0, 5],
    ) {
        /** Matrices */
        this.view = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])

        this.proj = new Float32Array(16)

        /** Vectors */
        this.to = new Float32Array(to)
        this.up = new Float32Array(up)
        this.from = new Float32Array(from)

        /** Projection */
        this.far = far
        this.near = near
        this.aspect = aspect
        this.angle = Math.PI * angle / 180 / 2

        this.depth = 1 / (this.far - this.near)
        this.sinAngle = Math.sin(this.angle)
        this.cosAngle = Math.cos(this.angle)
        this.tanAngle = Math.tan(this.angle)
        this.cotAngle = this.cosAngle / this.sinAngle

        this.proj[0] = this.cotAngle / this.aspect
        this.proj[5] = this.cotAngle
        this.proj[10] = -(this.far + this.near) * this.depth
        this.proj[11] = -1
        this.proj[14] = -2 * this.near * this.far * this.depth
    }

    cast(x, y) {
        /** Dummy Variables */
        const v = this.view

        /** Normalized Camera-Space Ray from Clicked Point */
        let xn = x * this.tanAngle * this.aspect
        let yn = y * this.tanAngle
        let zn = -1

        const inverseNorm = 1 / Math.sqrt(xn ** 2 + yn ** 2 + zn ** 2)

        xn *= inverseNorm
        yn *= inverseNorm
        zn *= inverseNorm

        /** Nomalized World-Space Ray after Inverse Camera Transform */
        return [
            v[0] * xn + v[1] * yn + v[2] * zn,
            v[4] * xn + v[5] * yn + v[6] * zn,
            v[8] * xn + v[9] * yn + v[10] * zn,
        ]
    }

    look() {
        /** Dummy Variables */
        const t = this.to
        const u = this.up
        const v = this.view
        const f = this.from

        /** Define Forward-Facing */
        let fx = f[0] - t[0]
        let fy = f[1] - t[1]
        let fz = f[2] - t[2]

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

        /** Calculate Cross Product of Side and Forward */
        const ux = fy * sz - fz * sy
        const uy = fz * sx - fx * sz
        const uz = fx * sy - fy * sx

        /** Assign Rotation to Look Matrix */
        v[0] = sx; v[4] = sy; v[8] = sz; v[12] = 0;
        v[1] = ux; v[5] = uy; v[9] = uz; v[13] = 0;
        v[2] = fx; v[6] = fy; v[10] = fz; v[14] = 0;
        v[3] = 0; v[7] = 0; v[11] = 0; v[15] = 1;

        /** Assign Translation to Look Matrix */
        v[12] += v[0] * -f[0] + v[4] * -f[1] + v[8] * -f[2]
        v[13] += v[1] * -f[0] + v[5] * -f[1] + v[9] * -f[2]
        v[14] += v[2] * -f[0] + v[6] * -f[1] + v[10] * -f[2]
        v[15] += v[3] * -f[0] + v[7] * -f[1] + v[11] * -f[2]

        return v
    }

    zoom(direction) {
        /** Zoom In or Out Depending on the Sign of Direction */
        this.from[0] += direction * 0.01 * (this.from[0] - this.to[0])
        this.from[1] += direction * 0.01 * (this.from[1] - this.to[1])
        this.from[2] += direction * 0.01 * (this.from[2] - this.to[2])

        /** Construct Look-At Matrix from New Vantage Point */
        this.look()
    }
}
