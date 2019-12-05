import bb from '../../../big-box/index.mjs'

import config from '../../resources/index.mjs'

export default class Pan {
    constructor() {
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

        this.invoke = this.invoke.bind(this)
    }

    rotate(orientation) {
        this.setRotation.invoke(this.setRotation.of, orientation, this.setRotation.result)
        this.setViewMatrix.invoke()

        return this.setPosition.invoke()
    }

    invoke(direction) {
        this.inverseView.invoke()

        switch (direction) {
            case config.DIRECTIONS.UP: return this.rotate(this.upRot)
            case config.DIRECTIONS.DOWN: return this.rotate(this.downRot)
            case config.DIRECTIONS.LEFT: return this.rotate(this.leftRot)
            case config.DIRECTIONS.RIGHT: return this.rotate(this.rightRot)
        }
    }
}
