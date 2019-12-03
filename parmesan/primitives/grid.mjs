import bb from '../../big-box/index.mjs'
import Primitive from './index.mjs'

export default class Grid extends Primitive {
    constructor({ resolution = 0.25, center }) {
        super(center)

        this.resolution = resolution

        this.points = bb.mesh({
            of: [
                bb.linspace({ start: -this.resolution, stop: this.resolution, num: Primitive.VERTEX_COUNT }).toRawFlat(),
                bb.linspace({ start: -this.resolution, stop: this.resolution, num: Primitive.VERTEX_COUNT }).toRawFlat(),
                bb.linspace({ start: -this.resolution, stop: this.resolution, num: Primitive.VERTEX_COUNT }).toRawFlat()
            ]
        })
    }
}
