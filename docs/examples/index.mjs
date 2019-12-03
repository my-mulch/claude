import bb from '../big-box/index.mjs'
import myio from '../myio.mjs'



export const box = {
    vertices: bb.tensor({ data: [[0, 0, 0], [0, 0, 1], [0, 0, 0], [0, 1, 0], [0, 0, 0], [1, 0, 0], [1, 1, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 0, 1], [0, 1, 1], [0, 1, 1], [0, 1, 0], [0, 1, 0], [1, 1, 0], [1, 1, 0], [1, 0, 0], [1, 0, 0], [1, 0, 1], [1, 0, 1], [0, 0, 1],] }),
    colors: bb.ones({ shape: [10000, 3] }),
    sizes: bb.ones({ shape: [10000, 1] }),
    mode: 'LINES'
}


/** RGB Cube */

var vertices = bb.randrange({ low: 0, high: 255, shape: [1e6, 3] }).divide({ with: 255 })
var colors = vertices
var sizes = bb.ones({ shape: [1e6, 1] })
var mode = 'POINTS'

export const rgb = { vertices, colors, sizes, mode }


/** Image Cube */

export const imageCube = async function (picture) {
    const { shape, pixels, binary } = await myio.imread(picture)

    var vertices = new bb.cached.divide({ of: bb.tensor({ data: pixels, type: bb.Float32 }).reshape({ shape: [-1, 3] }), with: 255 }).invoke()
    var colors = vertices
    var sizes = new bb.cached.multiply({ of: bb.ones({ shape: [vertices.shape[0], 1] }), with: 1 }).invoke()

    return { vertices, colors, sizes, mode: 'POINTS' }
}

/** Sound wave */

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