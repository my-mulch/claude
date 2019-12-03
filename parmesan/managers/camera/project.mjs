import config from '../../resources/index.mjs'

export default class Project {
    constructor() {
        this.reciprocalDepth = 1 / (config.FAR - config.NEAR)

        this.viewingAngle = Math.PI * config.VIEWING_ANGLE / 180 / 2
        this.sinOfViewingAngle = Math.sin(this.viewingAngle)
        this.cosOfViewingAngle = Math.cos(this.viewingAngle)
        this.cotOfViewingAngle = this.cosOfViewingAngle / this.sinOfViewingAngle

        this.invoke = this.invoke.bind(this)
    }

    invoke() {
        config.PROJECTION_MATRIX.data[0] = this.cotOfViewingAngle / config.ASPECT_RATIO
        config.PROJECTION_MATRIX.data[5] = this.cotOfViewingAngle
        config.PROJECTION_MATRIX.data[10] = -(config.FAR + config.NEAR) * this.reciprocalDepth
        config.PROJECTION_MATRIX.data[11] = -1
        config.PROJECTION_MATRIX.data[14] = -2 * config.NEAR * config.FAR * this.reciprocalDepth

        return config.PROJECTION_MATRIX
    }
}
