import bb from '../big-box'
import myio from '../myio'
import parmesan from '../parmesan'

window.bb = bb
window.myio = myio
window.app = parmesan

export default (async function () {
    /** Random points */
    window.vertices = bb.zeros({ shape: [10000, 2] })

    const sin = bb
        .arange({ stop: 10000 })
        .divide({ with: 10 })
        .sin()
        .multiply({ with: 10 })

    const cos = bb
        .arange({ stop: 10000 })
        .divide({ with: 10 })
        .cos()
        .multiply({ with: 10 })

    const axis = bb
        .arange({ stop: 10000 })
        .divide({ with: 10 })

    vertices
        .assign({ region: [':', 0], with: cos })
        .assign({ region: [':', 1], with: sin })

    window.colors = bb
        .zeros({ shape: [10000, 3] })
        .assign({ region: [':', 0], with: 255 })

    window.sizes = bb.ones({ shape: [10000, 1] }).multiply({ with: 1 })

    app.graphics.plot({ vertices, colors, sizes })

    // vertices
    //     .slice({ with: [':', 0] })
    //     .assign({
    //         with: bb
    //             .arange({ stop: 10000 })
    //             .divide({ with: 3 })
    //     })

    // vertices
    //     .slice({ with: [':', 1] })
    //     .assign({
    //         with: bb
    //             .arange({ stop: 10000 })
    //             .divide({ with: 10 })
    //             .sin()
    //             .multiply({ with: 10 })
    //     })

    // window.colors = bb.randint({ low: 255, high: 256, shape: [10000, 4], type: Uint8ClampedArray })
    // window.sizes = bb.ones({ shape: [10000, 1] }).multiply({ with: 1 })

    // window.vertices = bb.zeros({ shape: [10000, 2] })

    // vertices
    //     .slice({ with: [':', 0] })
    //     .assign({
    //         with: bb
    //             .arange({ stop: 10000 })
    //             .divide({ with: 3 })
    //     })

    // vertices
    //     .slice({ with: [':', 1] })
    //     .assign({
    //         with: bb
    //             .arange({ stop: 10000 })
    //             .divide({ with: 10 })
    //             .sin()
    //             .multiply({ with: 10 })
    //     })

    // window.colors = bb.ones({ shape: [10000, 4], type: Uint8ClampedArray })


    // window.sizes = bb.ones({ shape: [10000, 1] }).multiply({ with: 1 })

    /** Image CUBE */
    // const { shape, pixels, binary } = await myio.imread('http://localhost:8000/Users/trumanpurnell/Desktop/pics/lilp.jpg')

    // window.vertices = bb.array({ with: pixels }).reshape({ shape: [-1, 4] })
    // window.colors = vertices
    // window.sizes = bb.ones({ shape: [vertices.shape[0], 1] }).multiply({ with: 1 })



    /** RGB CUBE */
    // window.vertices = bb.randint({ low: 0, high: 256, shape: [1e6, 3], type: Uint8ClampedArray })
    // window.colors = vertices
    // window.sizes = bb
    //     .ones({ shape: [1e6, 1] })
    //     .multiply({ with: 2 })

})()
