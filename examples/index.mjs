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
            [0, 0, 1],
            [0, 1, 0],
            [1, 0, 0],
        ]
    }),

    colors: bb.rand({ shape: [10000, 3] }).negate(),
    sizes: bb.ones({ shape: [10000, 1] }).multiply({ with: 20 }),
    mode: 'POINTS'
}

/** Image CUBE */
    // const { shape, pixels, binary } = await myio.imread('http://localhost:3000/Users/trumanpurnell/Desktop/tahie.jpg')

    // window.vertices = bb
    //     .array({ with: pixels, type: Float32Array })
    //     .reshape({ shape: [-1, 3] })


    // window.colors = vertices.divide({ with: 255 })
    // window.sizes = bb.ones({ shape: [vertices.shape[0], 1] }).multiply({ with: 1 })


/** Cricle */
    // window.circle = bb
    //     .linspace({ start: 0, stop: 2 * Math.PI, num: 10000 })
    //     .multiply({ with: 'i' })

    // window.vertices = bb.zeros({ shape: [10000, 3], type: bb.ComplexFloat32 })
    // vertices.slice({ region: [':', 0] }).assign({ with: circle.exp() })

    // window.colors = bb.zeros({ shape: [10000, 3] })
    // colors.slice({ region: [':', ':2'] }).assign({ with: 255 })

    // window.sizes = bb.ones({ shape: [10000, 1] }).multiply({ with: 1 })

    // app.graphics.plot({ vertices, colors, sizes, mode: 'POINTS' })


/** RGB CUBE */
    // window.vertices = bb.randrange({ low: 0, high: 256, shape: [1e6, 3] })
    // window.colors = vertices.divide({ with: 255 })
    // window.sizes = bb.ones({ shape: [1e6, 1] }).multiply({ with: 3 })

    // app.graphics.plot({ vertices, colors, sizes, mode: 'POINTS' })