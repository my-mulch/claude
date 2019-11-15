import bb from '../../../big-box'

export default class Pan {
    constructor({ PAN_DELTA, VIEW_MATRIX, DIRECTIONS, TO }) {
        this.TO = TO
        this.PAN_DELTA = PAN_DELTA
        this.DIRECTIONS = DIRECTIONS
        this.VIEW_MATRIX = VIEW_MATRIX
        this.VIEW_MATRIX_T = this.VIEW_MATRIX.T()

        const s = Math.sin(this.PAN_DELTA)
        const c = Math.cos(this.PAN_DELTA)

        this.upRot = bb.tensor({ data: [[1, 0, 0, 0], [0, c, -s, 0], [0, s, c, 0], [0, 0, 0, 1]] })
        this.downRot = bb.tensor({ data: [[1, 0, 0, 0], [0, c, s, 0], [0, -s, c, 0], [0, 0, 0, 1]] })
        this.leftRot = bb.tensor({ data: [[c, 0, s, 0], [0, 1, 0, 0], [-s, 0, c, 0], [0, 0, 0, 1]] })
        this.rightRot = bb.tensor({ data: [[c, 0, -s, 0], [0, 1, 0, 0], [s, 0, c, 0], [0, 0, 0, 1]] })

        this.inverseView = new bb.inverse({ of: this.VIEW_MATRIX })
        this.VIEW_MATRIX_INV = this.inverseView.invoke()
        this.VIEW_MATRIX_INV_T = this.VIEW_MATRIX_INV.T()

        this.setRotation = new bb.matMult({ of: this.VIEW_MATRIX_INV_T, with: bb.template({ shape: [4, 4] }) })
        this.setViewMatrix = new bb.matMult({ of: this.setRotation.result, with: this.VIEW_MATRIX_T })
        this.setPosition = new bb.matMult({ of: this.setViewMatrix.result, with: this.TO, result: this.TO })
    }

    rotate(orientation) {
        this.setRotation.invoke(this.setRotation.of, orientation, this.setRotation.result)
        this.setViewMatrix.invoke()

        return this.setPosition.invoke()
    }

    invoke(direction) {
        this.inverseView.invoke()

        switch (direction) {
            case this.DIRECTIONS.UP: return this.rotate(this.upRot)
            case this.DIRECTIONS.DOWN: return this.rotate(this.downRot)
            case this.DIRECTIONS.LEFT: return this.rotate(this.leftRot)
            case this.DIRECTIONS.RIGHT: return this.rotate(this.rightRot)
        }
    }
}
