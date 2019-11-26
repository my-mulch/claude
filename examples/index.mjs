import bb from '../big-box'
import myio from '../myio'

export const grid = function (res) {
    const vertices = bb.mesh({
        of: [
            bb.linspace({ start: -0.25, stop: 0.25, num: res }).toRawFlat(),
            bb.linspace({ start: -0.25, stop: 0.25, num: res }).toRawFlat(),
            bb.linspace({ start: -0.25, stop: 0.25, num: res }).toRawFlat()
        ]
    })

    const colors = bb.zeros({ shape: [res ** 3, 3] }).assign({ with: bb.rand({ shape: [3] }) })
    const sizes = bb.ones({ shape: [res ** 3, 1] }).multiply({ with: 1 })
    const mode = 'POINTS'

    return { vertices, colors, sizes, mode }
}

export const vector = function () {
    const circle = bb
        .linspace({ start: 0, stop: 2 * Math.PI, num: 300 })
        .multiply({ with: 'i' })
        .exp()
        .reshape({ shape: [300, 1] })
        .view({ type: bb.Float32 })

    const vertices = circle
        .insert({
            with: 1, 
            entries: [2], 
            axis: [1]
        })
        .insert({
            with: [0, 0, 3],
            entries: bb.arange({ start: 0, stop: circle.shape[0] + 2, step: 2 }).toRawFlat(),
            axes: [0]
        })

    const colors = bb.zeros({ shape: [vertices.shape[0], 3] }).assign({ with: bb.rand({ shape: [3] }) })
    const sizes = bb.ones({ shape: [vertices.shape[0], 1] }).multiply({ with: 20 })
    const mode = 'TRIANGLES'

    return { vertices, colors, sizes, mode }
}

export const axes = {
    vertices: bb.tensor({
        data: [
            [0, 0, -10], [0, 0, 10],
            [0, -10, 0], [0, 10, 0],
            [-10, 0, 0], [10, 0, 0],
        ]
    }),

    colors: bb.ones({ shape: [10000, 3] }),
    sizes: bb.ones({ shape: [10000, 1] }),
    mode: 'LINES'
}

export const box = {
    vertices: bb.tensor({ data: [[0, 0, 0], [0, 0, 1], [0, 0, 0], [0, 1, 0], [0, 0, 0], [1, 0, 0], [1, 1, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 0, 1], [0, 1, 1], [0, 1, 1], [0, 1, 0], [0, 1, 0], [1, 1, 0], [1, 1, 0], [1, 0, 0], [1, 0, 0], [1, 0, 1], [1, 0, 1], [0, 0, 1],] }),
    colors: bb.ones({ shape: [10000, 3] }),
    sizes: bb.ones({ shape: [10000, 1] }),
    mode: 'LINES'
}

export const circle = {
    vertices: bb
        .linspace({ start: 0, stop: 2 * Math.PI, num: 10000 })
        .multiply({ with: 'i' })
        .exp()
        .reshape({ shape: [10000, 1] })
        .view({ type: bb.Float32 }),
    colors: bb.zeros({ shape: [10000, 3] }).assign({ with: [255, 255, 255] }),
    sizes: bb.ones({ shape: [10000, 1] }).multiply({ with: 1 }),
    mode: 'POINTS'
}


/** RGB Cube */

var vertices = bb.randrange({ low: 0, high: 255, shape: [1e6, 2] }).divide({ with: 255 })
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

    const colors = bb.zeros({ shape: [1e6, 3] }).assign({ with: bb.rand({ shape: [3] }) })
    const sizes = bb.ones({ shape: [soundData.length, 1] }).multiply({ with: 2 })
    const mode = 'POINTS'

    return { vertices, colors, sizes, mode }
}
