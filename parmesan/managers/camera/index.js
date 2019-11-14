import bb from '../../big-box/'
import config from '../resources'

export default class CameraManager {
    constructor() {
        this.config = config

        this.s = Math.sin(this.config.PAN_DELTA)
        this.c = Math.cos(this.config.PAN_DELTA)

        this.upRot = bb.tensor({ data: [[1, 0, 0, 0], [0, this.c, -this.s, 0], [0, this.s, this.c, 0], [0, 0, 0, 1]], type: bb.Float32 })
        this.downRot = bb.tensor({ data: [[1, 0, 0, 0], [0, this.c, this.s, 0], [0, -this.s, this.c, 0], [0, 0, 0, 1]], type: bb.Float32 })
        this.leftRot = bb.tensor({ data: [[this.c, 0, this.s, 0], [0, 1, 0, 0], [-this.s, 0, this.c, 0], [0, 0, 0, 1]], type: bb.Float32 })
        this.rightRot = bb.tensor({ data: [[this.c, 0, -this.s, 0], [0, 1, 0, 0], [this.s, 0, this.c, 0], [0, 0, 0, 1]], type: bb.Float32 })

        this.UP = bb.tensor({ data: [[0], [0], [0], [1]], type: bb.Float32 })
        this.TO = bb.tensor({ data: [[0], [1], [0], [1]], type: bb.Float32 })
        this.FROM = bb.tensor({ data: [[5], [5], [5], [1]], type: bb.Float32 })
    }

    lookAt() {
        this.viewMatrix = bb.eye({ shape: [4, 4], type: bb.Float32 })
        this.transMatrix = bb.eye({ shape: [4, 4], type: bb.Float32 })

        this.f = this.FROM.subtract({ with: this.TO })
        this.s = this.UP.cross({ with: this.f })

        this.uf = this.f.divide({ with: this.f.norm() })
        this.us = this.s.divide({ with: this.s.norm() })
        this.uu = this.uf.cross({ with: this.us })

        this.viewMatrix.slice({ region: [':3', '0:1'] }).assign({ with: this.us })
        this.viewMatrix.slice({ region: [':3', '1:2'] }).assign({ with: this.uu })
        this.viewMatrix.slice({ region: [':3', '2:3'] }).assign({ with: this.uf })

        this.transMatrix.slice({ region: ['3:4', ':3'] }).assign({ with: this.FROM.negate().T() })

        return this.transMatrix.matMult({ with: this.viewMatrix })
    }

    project() {
        const viewingAngle = Math.PI * this.config.VIEWING_ANGLE / 180 / 2
        const reciprocalDepth = 1 / (this.config.FAR - this.config.NEAR)

        const sinOfViewingAngle = Math.sin(viewingAngle)
        const cosOfViewingAngle = Math.cos(viewingAngle)
        const cotOfViewingAngle = cosOfViewingAngle / sinOfViewingAngle

        const projectionMatrix = new Float32Array(16)

        projectionMatrix[0] = cotOfViewingAngle / this.config.ASPECT_RATIO
        projectionMatrix[5] = cotOfViewingAngle
        projectionMatrix[10] = -(this.config.FAR + this.config.NEAR) * reciprocalDepth
        projectionMatrix[11] = -1
        projectionMatrix[14] = -2 * this.config.NEAR * this.config.FAR * reciprocalDepth

        return bb
            .tensor({ data: projectionMatrix, type: bb.Float32 })
            .reshape({ shape: [4, 4] })
    }

    rotate({ orientation, viewMatrix, viewMatrixInv }) {
        viewMatrixInv.T()
            .matMult({ with: orientation })
            .matMult({ with: viewMatrix.T() })
            .matMult({ with: this.TO, result: this.TO })
    }

    pan(direction) {
        const viewMatrix = this.lookAt()
        const viewMatrixInv = viewMatrix.inverse()

        switch (direction) {
            case this.config.UP_DIRECTION: return this.rotate({ orientation: this.upRot, viewMatrix, viewMatrixInv });
            case this.config.DOWN_DIRECTION: return this.rotate({ orientation: this.downRot, viewMatrix, viewMatrixInv });
            case this.config.LEFT_DIRECTION: return this.rotate({ orientation: this.leftRot, viewMatrix, viewMatrixInv });
            case this.config.RIGHT_DIRECTION: return this.rotate({ orientation: this.rightRot, viewMatrix, viewMatrixInv });
        }
    }

    zoom(zoomOut) {
        const action = zoomOut ? 'add' : 'subtract'
        const delta = this.FROM.subtract({ with: this.TO }).multiply({ with: this.config.ZOOM_DELTA })

        this.TO[action]({ with: delta, result: this.TO })
        this.FROM[action]({ with: delta, result: this.FROM })
    }

}
