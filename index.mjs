import myio from './myio'
import bb from './big-box'
import parmesan from './parmesan'

window.bb = bb
window.myio = myio
window.app = parmesan

export default (async function () {
    /** Random points */

    window.sin = bb
        .arange({ stop: 10000 })
        .divide({ with: 10 })
        .sin()
        .multiply({ with: 3 })

    window.cos = bb
        .arange({ stop: 10000 })
        .divide({ with: 10 })
        .cos()
        .multiply({ with: 3 })

    window.axis = bb.linspace({
        start: 0,
        stop: 2 * Math.PI,
        num: 10000,
        type: bb.ComplexFloat32
    }).multiply({ with: 'i' })

    // window.vertices = bb
    //     .zeros({ shape: [10000, 3] })
    //     .assign({ region: [':', 0], with: axis.exp() })

    // window.colors = bb
    //     .zeros({ shape: [10000, 3] })
    //     .assign({ region: [':', ':2'], with: 255 })

    // window.sizes = bb
    //     .ones({ shape: [10000, 1] })
    //     .multiply({ with: 1 })

    // app.graphics.plot({ vertices, colors, sizes, mode: 'POINTS' })

    /** Image CUBE */
    // const { shape, pixels, binary } = await myio.imread('http://localhost:3000/Users/trumanpurnell/Desktop/tahie.jpg')

    // window.vertices = bb
    //     .array({ with: pixels, type: Float32Array })
    //     .reshape({ shape: [-1, 3] })


    // window.colors = vertices.divide({ with: 255 })
    // window.sizes = bb.ones({ shape: [vertices.shape[0], 1] }).multiply({ with: 1 })


    /** RGB CUBE */
    window.vertices = bb.randrange({ low: 0, high: 256, shape: [1e6, 3] })
    window.colors = vertices.divide({ with: 255 })
    window.sizes = bb.ones({ shape: [1e6, 1] }).multiply({ with: 3 })

    app.graphics.plot({ vertices, colors, sizes, mode: 'POINTS' })
})()
