import { translate, transpose, frame, normalize, transposeMatrixByVector } from './utils.mjs'

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
        from = [3, 1, 3],
    ) {
        /** Vectors */
        this.to = new Float32Array(to)
        this.up = new Float32Array(up)
        this.from = new Float32Array(from)

        /** Frame (front-facing, side-facing, up-facing) */
        this.ff = new Float32Array(3)
        this.uf = new Float32Array(3)
        this.sf = new Float32Array(3)

        /** Ray Caster */
        this.ray = new Float32Array(3)

        /** Matrices */
        this.view = new Float32Array(16)
        this.proj = new Float32Array(16)

        /** Compute Look-At */
        this.look()

        /** Projection */
        this.far = far
        this.near = near
        this.aspect = aspect
        this.angle = Math.PI * angle / 180 / 2

        this.depth = 1 / (this.far - this.near)
        this.tanAngle = Math.tan(this.angle)
        this.cotAngle = 1 / this.tanAngle

        this.proj[0] = this.cotAngle / this.aspect
        this.proj[5] = this.cotAngle
        this.proj[10] = -(this.far + this.near) * this.depth
        this.proj[11] = -1
        this.proj[14] = -2 * this.near * this.far * this.depth
    }

    cast(x, y) {
        /** Normalized Camera-Space Ray from Clicked Point */
        this.ray[0] = x * this.tanAngle * this.aspect
        this.ray[1] = y * this.tanAngle
        this.ray[2] = -1

        normalize(this.ray)

        /** Nomalized World-Space Ray via Inverse Camera Transform */
        return transposeMat3ByVec3(this.view, this.ray)
    }

    look() {
        /** Create Orthonormal Frame */
        frame(
            this.from, this.to, this.up, // Points
            this.ff, this.sf, this.uf, // Resulting Frame
        )

        /** Dummy Variables */
        const s = this.sf // side
        const f = this.ff // front
        const u = this.uf // up
        const v = this.view

        /** Invert the Orthonormal Frame */
        v[0] = s[0]; v[4] = s[1]; v[8] = s[2]; v[12] = 0
        v[1] = u[0]; v[5] = u[1]; v[9] = u[2]; v[13] = 0
        v[2] = f[0]; v[6] = f[1]; v[10] = f[2]; v[14] = 0
        v[3] = 0; v[7] = 0; v[11] = 0; v[15] = 1

        /** Translate the Orthonormal Frame */
        translate(-this.from[0], -this.from[1], -this.from[2], v)
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
