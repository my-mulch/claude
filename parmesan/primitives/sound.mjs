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
            .tensor({ data: this.samples, type: bb.Float32 })
            .reshape({ shape: [-1, 1] })
            .insert({
                with: bb.linspace({ start: 0, stop: 5, num: this.samples.length }).reshape({ shape: [-1, 1] }),
                axes: [1],
                entries: [0]
            })

        return [{
            vertices: this.points,
            colors: bb.ones({ shape: [this.samples.length, 2] }),
            sizes: bb.ones({ shape: [this.samples.length, 1] }),
            mode: 'POINTS'
        }]
    }
}
