import bb from '../big-box'

export const axes = {
    vertices: bb.tensor({
        data: [
            [0, 0, 0], [0, 0, 1e8],
            [0, 0, 0], [0, 1e8, 0],
            [0, 0, 0], [1e8, 0, 0],
        ]
    }),

    colors: bb.ones({ shape: [10000, 3] }),
    sizes: bb.ones({ shape: [10000, 1] }),
    mode: 'LINES'
}

export const points = {
    vertices: bb.tensor({
        data: [
            [0, 0, 0],
            [0, 0, 1],
            [0, 1, 0],
            [0, 1, 1],
            [1, 0, 0],
            [1, 0, 1],
            [1, 1, 0],
            [1, 1, 1],

            [0, 1, 1 / 10],
            [0, 1, 2 / 10],
            [0, 1, 3 / 10],
            [0, 1, 4 / 10],
            [0, 1, 5 / 10],
            [0, 1, 6 / 10],
            [0, 1, 7 / 10],
            [0, 1, 8 / 10],
            [0, 1, 9 / 10],
            [0, 1, 10 / 10],

            [1, 1 / 10, 0],
            [1, 2 / 10, 0],
            [1, 3 / 10, 0],
            [1, 4 / 10, 0],
            [1, 5 / 10, 0],
            [1, 6 / 10, 0],
            [1, 7 / 10, 0],
            [1, 8 / 10, 0],
            [1, 9 / 10, 0],
            [1, 10 / 10, 0],

            [1, 0, 1 / 10],
            [1, 0, 2 / 10],
            [1, 0, 3 / 10],
            [1, 0, 4 / 10],
            [1, 0, 5 / 10],
            [1, 0, 6 / 10],
            [1, 0, 7 / 10],
            [1, 0, 8 / 10],
            [1, 0, 9 / 10],
            [1, 0, 10 / 10],

            [0, 1 / 10, 1],
            [0, 2 / 10, 1],
            [0, 3 / 10, 1],
            [0, 4 / 10, 1],
            [0, 5 / 10, 1],
            [0, 6 / 10, 1],
            [0, 7 / 10, 1],
            [0, 8 / 10, 1],
            [0, 9 / 10, 1],
            [0, 10 / 10, 1],

            [1 / 10, 1 / 10, 1],
            [2 / 10, 2 / 10, 1],
            [3 / 10, 3 / 10, 1],
            [4 / 10, 4 / 10, 1],
            [5 / 10, 5 / 10, 1],
            [6 / 10, 6 / 10, 1],
            [7 / 10, 7 / 10, 1],
            [8 / 10, 8 / 10, 1],
            [9 / 10, 9 / 10, 1],
            [10 / 10, 10 / 10, 1],
        ]
    }),

    colors: bb.tensor({
        data: [

            [0, 0, 0],
            [0, 0, 1],
            [0, 1, 0],
            [0, 1, 1],
            [1, 0, 0],
            [1, 0, 1],
            [1, 1, 0],
            [1, 1, 1],

            [0, 1, 1 / 10],
            [0, 1, 2 / 10],
            [0, 1, 3 / 10],
            [0, 1, 4 / 10],
            [0, 1, 5 / 10],
            [0, 1, 6 / 10],
            [0, 1, 7 / 10],
            [0, 1, 8 / 10],
            [0, 1, 9 / 10],
            [0, 1, 10 / 10],

            [1, 1 / 10, 0],
            [1, 2 / 10, 0],
            [1, 3 / 10, 0],
            [1, 4 / 10, 0],
            [1, 5 / 10, 0],
            [1, 6 / 10, 0],
            [1, 7 / 10, 0],
            [1, 8 / 10, 0],
            [1, 9 / 10, 0],
            [1, 10 / 10, 0],

            [1, 0, 1 / 10],
            [1, 0, 2 / 10],
            [1, 0, 3 / 10],
            [1, 0, 4 / 10],
            [1, 0, 5 / 10],
            [1, 0, 6 / 10],
            [1, 0, 7 / 10],
            [1, 0, 8 / 10],
            [1, 0, 9 / 10],
            [1, 0, 10 / 10],

            [0, 1 / 10, 1],
            [0, 2 / 10, 1],
            [0, 3 / 10, 1],
            [0, 4 / 10, 1],
            [0, 5 / 10, 1],
            [0, 6 / 10, 1],
            [0, 7 / 10, 1],
            [0, 8 / 10, 1],
            [0, 9 / 10, 1],
            [0, 10 / 10, 1],

            [1 / 10, 1 / 10, 1],
            [2 / 10, 2 / 10, 1],
            [3 / 10, 3 / 10, 1],
            [4 / 10, 4 / 10, 1],
            [5 / 10, 5 / 10, 1],
            [6 / 10, 6 / 10, 1],
            [7 / 10, 7 / 10, 1],
            [8 / 10, 8 / 10, 1],
            [9 / 10, 9 / 10, 1],
            [10 / 10, 10 / 10, 1],
        ]
    }),

    sizes: new bb.cached.multiply({ of: bb.ones({ shape: [10000, 1] }), with: 20 }).invoke(),
    mode: 'POINTS'
}

export const circle = {
    vertices: bb.linspace({ start: 0, stop: 2 * Math.PI, num: 10000 }).multiply({ with: 'i' }).exp(),
    colors: bb.zeros({ shape: [10000, 1], type: bb.QuatFloat32 }).assign({ with: '1 + i + j + k' }),
    sizes: bb.ones({ shape: [10000, 1] }).multiply({ with: 1 }),
    mode: 'POINTS'
}


/** RGB Cube */

var vertices = new bb.cached.divide({ of: bb.randrange({ low: 0, high: 255, shape: [100, 1], type: bb.QuatFloat32 }), with: 255 }).invoke()
var colors = vertices
var sizes = new bb.cached.multiply({ of: bb.ones({ shape: [100, 1] }), with: 10 }).invoke()
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
