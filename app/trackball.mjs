
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

        /** Vectors on the Trackball */
        this.start = null
        this.pointer = null

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
        return [
            [ray[0] * t0 + tx, ray[1] * t0 + ty, ray[2] * t0 + tz],
            [ray[0] * t1 + tx, ray[1] * t1 + ty, ray[2] * t1 + tz],
        ]
    }

    track(pointer) {
        /** Dummy Variables */
        const p = pointer
        const s = this.start
        const r = this.rotation
        const o = this.orientation

        /** Norm of Start and Pointer */
        const sn = Math.sqrt(s[0] ** 2 + s[1] ** 2 + s[2] ** 2)
        const pn = Math.sqrt(p[0] ** 2 + p[1] ** 2 + p[2] ** 2)

        /** Normalized Cross Product of Start and Pointer */
        let cx = s[1] * p[2] - u[2] * p[1]
        let cy = s[2] * p[0] - u[0] * p[2]
        let cz = s[0] * p[1] - u[1] * p[0]

        const vectorInverseNorm = Math.sqrt(1 / cx ** 2 + cy ** 2 + cz ** 2)

        cx *= vectorInverseNorm
        cy *= vectorInverseNorm
        cz *= vectorInverseNorm

        /** Dot Product of Start and Pointer */
        const dp = s[0] * p[0] + s[1] * p[1] + s[2] * p[2]

        /** Angle Between Start and Pointer */
        const angle = Math.acos(dp / norm)

        if (isNaN(angle)) return

        /** Construct Quaternion to Represent Rotation */
        qw = Math.cos(angle / 2)
        qx = Math.sin(angle / 2) * cx
        qy = Math.sin(angle / 2) * cy
        qz = Math.sin(angle / 2) * cz

        /** Apply Rotation via Quaternion Multiplication */
        r[0] = qw * o[0] - qx * o[1] - qy * o[2] - qz * o[3]
        r[1] = qx * o[0] + qw * o[1] + qy * o[3] - qz * o[2]
        r[2] = qw * o[2] - qx * o[3] + qy * o[0] + qz * o[1]
        r[3] = qw * o[3] + qx * o[2] - qy * o[1] + qz * o[0]

        /** To Model Matrix */
        this.model[0] = 1.0 - 2.0 * r[2] * r[2] - 2.0 * r[3] * r[3]
        this.model[4] = 2.0 * r[1] * r[2] - 2.0 * r[3] * r[0]
        this.model[8] = 2.0 * r[1] * r[3] + 2.0 * r[2] * r[0]
        this.model[12] = 0.0

        this.model[1] = 2.0 * r[1] * r[2] + 2.0 * r[3] * r[0]
        this.model[5] = 1.0 - 2.0 * r[1] * r[1] - 2.0 * r[3] * r[3]
        this.model[9] = 2.0 * r[2] * r[3] - 2.0 * r[1] * r[0]
        this.model[13] = 0.0

        this.model[2] = 2.0 * r[1] * r[3] - 2.0 * r[2] * r[0]
        this.model[6] = 2.0 * r[2] * r[3] + 2.0 * r[1] * r[0]
        this.model[10] = 1.0 - 2.0 * r[1] * r[1] - 2.0 * r[2] * r[2]
        this.model[14] = 0.0

        this.model[3] = 0
        this.model[7] = 0
        this.model[11] = 0
        this.model[15] = 1.0
    }

    stop() {
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
