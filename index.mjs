import myio from './myio'
import bb from './big-box'
import parmesan from './parmesan'
import config from './parmesan/resources'

import { axes, circle, rgb, imageCube, box } from './examples'

window.bb = bb
window.myio = myio
window.app = parmesan
window.config = config
window.shapes = { axes, circle, rgb, imageCube }

export default (async function () {
    app.plot({
        vertices: bb
            .zeros({ shape: [2646000, 2] })
            .assign({
                region: [':', 0],
                with: bb.linspace({ start: 0, stop: 20, num: 2646000 })
            })
            .assign({
                region: [':', 1],
                with: bb.tensor({
                    data: await myio.audioread('http://localhost:3000/Users/trumanpurnell/Music/PinkPanther60.wav'),
                    type: bb.Float32
                })
            }),
        colors: bb.zeros({ shape: [2646000, 3] }).assign({ with: [255, 255, 0] }),
        sizes: bb.ones({ shape: [2646000, 1] }).multiply({ with: 1 }),
        mode: 'POINTS'
    })

    // app.plot(await imageCube('http://localhost:3000/Users/trumanpurnell/Pictures/68828786_10217017620425433_2350853209913819136_o.jpg'))
    // app.plot(axes)
    // app.plot(rgb)
    // app.plot(circle)
    app.plot(box)
})()
