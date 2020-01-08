
export default class Trackball {
    constructor(
        radius = 1,
        center = [0, 0, 0],
        rotation = [1, 0, 0, 0], // Quaternion
    ) {
        this.center = center
        this.radius = radius
        this.rotation = new Float32Array(rotation)
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

        if (!discriminant)
            return [-0.5 * b / a, -0.5 * b / a]

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

    start() {

    }

}
