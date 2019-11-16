
export default class Project {
    constructor({ FAR, NEAR, VIEWING_ANGLE, ASPECT_RATIO, PROJECTION_MATRIX }) {
        this.FAR = FAR
        this.NEAR = NEAR
        this.ASPECT_RATIO = ASPECT_RATIO
        this.VIEWING_ANGLE = VIEWING_ANGLE
        this.PROJECTION_MATRIX = PROJECTION_MATRIX

        this.reciprocalDepth = 1 / (this.FAR - this.NEAR)

        this.viewingAngle = Math.PI * VIEWING_ANGLE / 180 / 2
        this.sinOfViewingAngle = Math.sin(this.viewingAngle)
        this.cosOfViewingAngle = Math.cos(this.viewingAngle)
        this.cotOfViewingAngle = this.cosOfViewingAngle / this.sinOfViewingAngle

        this.invoke = this.invoke.bind(this)
    }

    invoke() {
        this.PROJECTION_MATRIX.data[0] = this.cotOfViewingAngle / this.ASPECT_RATIO
        this.PROJECTION_MATRIX.data[5] = this.cotOfViewingAngle
        this.PROJECTION_MATRIX.data[10] = -(this.FAR + this.NEAR) * this.reciprocalDepth
        this.PROJECTION_MATRIX.data[11] = -1
        this.PROJECTION_MATRIX.data[14] = -2 * this.NEAR * this.FAR * this.reciprocalDepth

        return this.PROJECTION_MATRIX
    }
}
