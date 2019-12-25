import bb from '../bb/index.mjs'
import config from '../res/config.mjs'

export default class Camera {
    constructor() {
        /** Look Setup */
        this.negateFrom = new bb.cached.negate({ of: config.FROM })

        this.front = new bb.cached.subtract({ of: config.FROM, with: config.TO })
        this.side = new bb.cached.cross({ of: config.UP, with: this.front.result })

        this.unitSide = new bb.cached.unit({ of: this.side.result })
        this.unitFront = new bb.cached.unit({ of: this.front.result })
        this.unitUp = new bb.cached.cross({ of: this.unitFront.result, with: this.unitSide.result })

        this.assignUpFrame = new bb.cached.assign({ of: config.VIEW_MATRIX, region: [':3', '1:2'], with: this.unitUp.result })
        this.assignSideFrame = new bb.cached.assign({ of: config.VIEW_MATRIX, region: [':3', '0:1'], with: this.unitSide.result })
        this.assignFrontFrame = new bb.cached.assign({ of: config.VIEW_MATRIX, region: [':3', '2:3'], with: this.unitFront.result })
        this.assignTranslation = new bb.cached.assign({ of: config.MOVE_MATRIX, region: ['3:4', ':3'], with: this.negateFrom.result.T() })

        this.createView = new bb.cached.matMult({ of: config.MOVE_MATRIX, with: config.VIEW_MATRIX, result: config.LOOK_MATRIX })

        /** Project Setup */
        this.reciprocalDepth = 1 / (config.FAR - config.NEAR)

        this.viewingAngle = Math.PI * config.VIEWING_ANGLE / 180 / 2
        this.sinOfViewingAngle = Math.sin(this.viewingAngle)
        this.cosOfViewingAngle = Math.cos(this.viewingAngle)
        this.cotOfViewingAngle = this.cosOfViewingAngle / this.sinOfViewingAngle

        /** Pan Setup */
        

        /** Zoom Setup */
        this.gaze = new bb.cached.subtract({ of: config.FROM, with: config.TO })
    }

    look() {
        this.negateFrom.invoke()

        this.front.invoke()
        this.side.invoke()

        this.unitSide.invoke()
        this.unitFront.invoke()
        this.unitUp.invoke()

        this.assignUpFrame.invoke()
        this.assignSideFrame.invoke()
        this.assignFrontFrame.invoke()
        this.assignTranslation.invoke()

        return this.createView.invoke()
    }

    project() {
        config.PROJ_MATRIX.data[0] = this.cotOfViewingAngle / config.ASPECT_RATIO
        config.PROJ_MATRIX.data[5] = this.cotOfViewingAngle
        config.PROJ_MATRIX.data[10] = -(config.FAR + config.NEAR) * this.reciprocalDepth
        config.PROJ_MATRIX.data[11] = -1
        config.PROJ_MATRIX.data[14] = -2 * config.NEAR * config.FAR * this.reciprocalDepth

        return config.PROJ_MATRIX
    }

    track() {

    }

    zoom(delta) {
        this.gaze.invoke()
        
        config.FROM.data[0] += delta / 1000 * this.gaze.result.data[0]
        config.FROM.data[1] += delta / 1000 * this.gaze.result.data[1]
        config.FROM.data[2] += delta / 1000 * this.gaze.result.data[2]
    }
}
