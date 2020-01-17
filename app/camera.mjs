import { translate, frame, normalize, transposeMat3ByVec3 } from './utils.mjs'

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
        this.location = {
            to: new Float32Array(to),
            up: new Float32Array(up),
            from: new Float32Array(from)
        }

        /** Frame (front-facing, side-facing, up-facing) */
        this.frame = {
            up: new Float32Array(3),
            side: new Float32Array(3),
            front: new Float32Array(3)
        }
        
        /** Properties */
        this.far = far
        this.near = near
        this.aspect = aspect
        this.angle = Math.PI * angle / 180 / 2

        /** Ray Caster */
        this.ray = new Float32Array(3)

        /** Matrices */
        this.view = new Float32Array(16)
        this.proj = new Float32Array(16)

        /** Compute View Matrix */
        this.look()
        this.project()
    }

    cast(pointer) {
        /** Normalized Camera-Space Ray from Clicked Point */
        this.ray[0] = pointer[0] * this.tanAngle * this.aspect
        this.ray[1] = pointer[1] * this.tanAngle
        this.ray[2] = -1

        normalize(this.ray)

        /** Nomalized World-Space Ray via Inverse Camera Transform */
        return transposeMat3ByVec3(this.view, this.ray)
    }

    project() {
        this.depth = 1 / (this.far - this.near)
        this.tanAngle = Math.tan(this.angle)
        this.cotAngle = 1 / this.tanAngle

        this.proj[0] = this.cotAngle / this.aspect
        this.proj[5] = this.cotAngle
        this.proj[10] = -(this.far + this.near) * this.depth
        this.proj[11] = -1
        this.proj[14] = -2 * this.near * this.far * this.depth
    }

    look() {
        /** Create Orthonormal Frame */
        frame(
            this.location.from, this.location.to, this.location.up, // Points
            this.frame.front, this.frame.side, this.frame.up, // Resulting Frame
        )

        /** Dummy Variables */
        const v = this.view
        const u = this.frame.up // up
        const s = this.frame.side // side
        const f = this.frame.front // front

        /** Invert the Orthonormal Frame */
        v[0] = s[0]; v[4] = s[1]; v[8] = s[2]; v[12] = 0
        v[1] = u[0]; v[5] = u[1]; v[9] = u[2]; v[13] = 0
        v[2] = f[0]; v[6] = f[1]; v[10] = f[2]; v[14] = 0
        v[3] = 0; v[7] = 0; v[11] = 0; v[15] = 1

        /** Translate the Orthonormal Frame */
        translate(-this.location.from[0], -this.location.from[1], -this.location.from[2], v)
    }

    zoom(direction) {
        /** Dummy Variables */
        const t = this.location.to
        const f = this.location.from

        /** Zoom In or Out Depending on the Sign of Direction */
        f[0] += direction * 0.01 * (f[0] - t[0])
        f[1] += direction * 0.01 * (f[1] - t[1])
        f[2] += direction * 0.01 * (f[2] - t[2])

        /** Construct Look-At Matrix from New Vantage Point */
        this.look()
    }
}
