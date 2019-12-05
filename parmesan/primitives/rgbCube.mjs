import bb from '../../big-box/index.mjs'
import Primitive from './index.mjs'

export default class RGBCube extends Primitive {
    constructor({ center }) {
        super(center)

        this.points = bb.rand([Primitive.VERTEX_COUNT ** 3, 3])
    }

    render() {
        return [{
            vertices: this.points,
            colors: this.points,
            sizes: bb.ones([Primitive.VERTEX_COUNT ** 3, 1]),
            mode: 'POINTS'
        }]
    }
}
