import { normalize, cross, dot, norm, quatMult, quatToRotation } from './utils.mjs'

export default class Trackball {
    constructor(
        radius = 1,
        center = [0, 0, 0],
    ) {
        /** Properties of the Trackball */
        this.radius = radius
        this.center = new Float32Array(center)

        /** Quaternions for the Trackball */
        this.rotation = new Float32Array([1, 0, 0, 0])
        this.orientation = new Float32Array([1, 0, 0, 0])
        this.intermediate = new Float32Array([1, 0, 0, 0])

        /** Points of Intersection */
        this.p1 = new Float32Array(3)
        this.p2 = new Float32Array(3)
        this.start = new Float32Array(3)

        /** Axis of Rotation */
        this.axis = new Float32Array(3)        

        /** Model Matrix for the Trackball */
        this.model = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        ])
    }

    intersect(ray, origin) {
        /** Vector in Direction of Ray-Origin */
        const tx = origin[0] - this.center[0]
        const ty = origin[1] - this.center[1]
        const tz = origin[2] - this.center[2]

        /** Constants A, B, C of Quadratic Polynomial  */
        const a = ray[0] ** 2 + ray[1] ** 2 + ray[2] ** 2
        const b = 2 * (ray[0] * tx + ray[1] * ty + ray[2] * tz)
        const c = tx ** 2 + ty ** 2 + tz ** 2 - this.radius ** 2

        /** Solve Quadratic Equation */
        const discriminant = b ** 2 - 4 * a * c

        if (!discriminant) return [-0.5 * b / a, -0.5 * b / a]

        const q = (b > 0) ?
            -0.5 * (b + Math.sqrt(discriminant)) :
            -0.5 * (b - Math.sqrt(discriminant))

        /** Roots */
        const t0 = c / q
        const t1 = q / a

        /** Intersection Points */
        this.p1[0] = ray[0] * t0 + tx
        this.p1[1] = ray[1] * t0 + ty
        this.p1[2] = ray[2] * t0 + tz

        this.p2[0] = ray[0] * t1 + tx
        this.p2[1] = ray[1] * t1 + ty
        this.p2[2] = ray[2] * t1 + tz
    }

    track() {
        /** Dummy Variables */
        const p = this.p1
        const m = this.model
        const s = this.start
        const r = this.rotation
        const o = this.orientation
        const i = this.intermediate

        /** Normalized Cross Product of Start and Pointer to Create Axis of Rotation */
        normalize(cross(s, p, this.axis))

        /** Angle between Start and Pointer */
        const angle = Math.acos(dot(s, p) / (norm(s) * norm(p)))

        /** Small Angles Occasionally Divide by Zero */
        if (isNaN(angle)) return

        /** Construct Quaternion to Represent Rotation */
        i[0] = Math.cos(angle / 2)
        i[1] = Math.sin(angle / 2) * this.axis[0]
        i[2] = Math.sin(angle / 2) * this.axis[1]
        i[3] = Math.sin(angle / 2) * this.axis[2]

        /** Apply Rotation via Quaternion Multiplication */
        quatMult(i, o, r)

        /** Transform Quat To Model Matrix */
        quatToRotation(r, m)
    }

    play() {
        /** Dummy Variables */
        const p = this.p1
        const s = this.start

        s[0] = p[0]
        s[1] = p[1]
        s[2] = p[2]
    }

    pause() {
        /** Dummy Variables */
        const r = this.rotation
        const o = this.orientation

        /** Assign New Orientation from Last Rotation */
        o[0] = r[0]
        o[1] = r[1]
        o[2] = r[2]
        o[3] = r[3]
    }
}
