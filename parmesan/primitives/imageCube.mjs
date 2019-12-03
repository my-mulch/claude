import bb from '../../big-box/index.mjs'
import myio from '../../myio/index.mjs'
import Primitive from './index.mjs'

export default class ImageCube extends Primitive {
    constructor({ path, center }) {
        super(center)

        this.path = path
    }

    async render() {
        this.pixels = await myio.imread(this.path)

        this.points = bb
            .tensor({ data: this.pixels, type: bb.Float32 })
            .reshape({ shape: [-1, 3] })
            .divide({ with: 255 })

        return [{
            vertices: this.points,
            colors: this.points,
            sizes: bb.ones({ shape: [this.points.shape[0], 1] }),
            mode: 'POINTS'
        }]
    }
}
