import bb from '../big-box'

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
    vertices: bb.tensor({
        data: [
            [0, 0, 0], [0, 0, 1],
            [0, 0, 0], [0, 1, 0],
            [0, 0, 0], [1, 0, 0],
            [1, 1, 1], [1, 0, 1],
            [1, 1, 1], [0, 1, 1],
            [1, 1, 1], [1, 1, 0],
            [0, 0, 1], [0, 1, 1],
            [0, 1, 1], [0, 1, 0],
            [0, 1, 0], [1, 1, 0],
            [1, 1, 0], [1, 0, 0],
            [1, 0, 0], [1, 0, 1],
            [1, 0, 1], [0, 0, 1],
        ]
    }),

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

export const imageCube = async function (picture = 'http://localhost:3000/Users/trumanpurnell/Pictures/68828786_10217017620425433_2350853209913819136_o.jpg') {
    const { shape, pixels, binary } = await myio.imread(picture)

    var vertices = new bb.cached.divide({ of: bb.tensor({ data: pixels, type: bb.Float32 }).reshape({ shape: [-1, 3] }), with: 255 }).invoke()
    var colors = vertices
    var sizes = new bb.cached.multiply({ of: bb.ones({ shape: [vertices.shape[0], 1] }), with: 1 }).invoke()

    return { vertices, colors, sizes, mode: 'POINTS' }
}
