import bb from '../../big-box/index.mjs'
import myio from '../../myio/index.mjs'
import Primitive from './index.mjs'

export default class ImageCube extends Primitive {
    constructor({ path, center }) {
        super(center)

        this.path = path
    }

    async render() {
        this.samples = await myio.audioread(this.path)

        this.points = bb
            .tensor(this.samples)
            .reshape([-1, 1])
            .insert({
                with: bb.linspace(0, 5, this.samples.length).reshape([-1, 1]),
                axes: [1],
                entries: [0]
            })

        return [{
            vertices: this.points,
            colors: bb.ones([this.samples.length, 2]),
            sizes: bb.ones([this.samples.length, 1]),
            mode: 'POINTS'
        }]
    }
}
