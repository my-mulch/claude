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
        const s = Math.sin(config.PAN_DELTA)
        const c = Math.cos(config.PAN_DELTA)

        this.upRot = bb.tensor([[[1], [0], [0], [0]], [[0], [c], [-s], [0]], [[0], [s], [c], [0]], [[0], [0], [0], [1]]])
        this.downRot = bb.tensor([[[1], [0], [0], [0]], [[0], [c], [s], [0]], [[0], [-s], [c], [0]], [[0], [0], [0], [1]]])
        this.leftRot = bb.tensor([[[c], [0], [s], [0]], [[0], [1], [0], [0]], [[-s], [0], [c], [0]], [[0], [0], [0], [1]]])
        this.rightRot = bb.tensor([[[c], [0], [-s], [0]], [[0], [1], [0], [0]], [[s], [0], [c], [0]], [[0], [0], [0], [1]]])

        this.inverseView = new bb.cached.inverse({ of: config.LOOK_MATRIX })
        this.setRotation = new bb.cached.matMult({ of: this.inverseView.result.T(), with: bb.zeros([4, 4]) })
        this.setViewMatrix = new bb.cached.matMult({ of: this.setRotation.result, with: config.LOOK_MATRIX.T() })
        this.setPosition = new bb.cached.matMult({ of: this.setViewMatrix.result, with: config.TO, result: config.TO })

        /** Zoom Setup */
        this.gaze = new bb.cached.subtract({ of: config.FROM, with: config.TO })
        this.delta = new bb.cached.multiply({ of: this.gaze.result, with: config.ZOOM_DELTA })

        this.zoomInTo = new bb.cached.subtract({ of: config.TO, with: this.delta.result, result: config.TO })
        this.zoomInFrom = new bb.cached.subtract({ of: config.FROM, with: this.delta.result, result: config.FROM })

        this.zoomOutTo = new bb.cached.add({ of: config.TO, with: this.delta.result, result: config.TO })
        this.zoomOutFrom = new bb.cached.add({ of: config.FROM, with: this.delta.result, result: config.FROM })
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

    pan(direction) {
        this.inverseView.invoke()

        switch (direction) {
            case config.DIRECTIONS.UP: return this.rotate(this.upRot)
            case config.DIRECTIONS.DOWN: return this.rotate(this.downRot)
            case config.DIRECTIONS.LEFT: return this.rotate(this.leftRot)
            case config.DIRECTIONS.RIGHT: return this.rotate(this.rightRot)
        }
    }

    rotate(orientation) {
        this.setRotation.invoke(this.setRotation.of, orientation, this.setRotation.result)
        this.setViewMatrix.invoke()

        return this.setPosition.invoke()
    }

    zoom(zoomOut) {
        this.gaze.invoke()
        this.delta.invoke()

        if (zoomOut)
            return this.zoomOut()

        return this.zoomIn()
    }

    zoomIn() {
        return [
            this.zoomInTo.invoke(),
            this.zoomInFrom.invoke()
        ]
    }

    zoomOut() {
        return [
            this.zoomOutTo.invoke(),
            this.zoomOutFrom.invoke()
        ]
    }
}
