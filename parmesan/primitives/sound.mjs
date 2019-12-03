export const soundWave = async function (sound) {
    const soundData = await myio.audioread(sound)

    const vertices = bb.zeros({ shape: [soundData.length, 2] })
        .assign({
            region: [':', 0],
            with: bb.linspace({ start: 0, stop: 10, num: soundData.length })
        })
        .assign({
            region: [':', 1],
            with: bb.tensor({ data: soundData, type: bb.Float32 })
        })

    const colors = bb.zeros({ shape: [vertices.shape[0], 3] }).assign({ with: bb.rand({ shape: [3] }) })
    const sizes = bb.ones({ shape: [vertices.shape[0], 1] }).multiply({ with: 2 })
    const mode = 'POINTS'

    return { vertices, colors, sizes, mode }
}

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
