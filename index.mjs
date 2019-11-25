import myio from './myio'
import bb from './big-box'
import parmesan from './parmesan'
import config from './parmesan/resources'

import { axes, circle, rgb, imageCube, box, grid, soundWave } from './examples'

window.bb = bb
window.myio = myio
window.app = parmesan
window.config = config
window.shapes = { axes, circle, rgb, imageCube, grid }

export default (async function () {
    // app.plot(await soundWave('http://localhost:3000/Users/trumanpurnell/Music/taunt.wav'))
    // app.plot(await imageCube('http://localhost:3000/Users/trumanpurnell/Pictures/68828786_10217017620425433_2350853209913819136_o.jpg'))
    app.plot(axes)
    // app.plot(rgb)
    app.plot(circle)
    // app.plot(grid(1.2e2))
    // app.plot(box)

    app.plot({
        vertices: bb.tensor({
            data: [
                ["0.80901700258255", "0.5877852439880371", 0],
                ["0.30901697278022766", "0.9510565400123596", 0],
                [0, 0, -3],
                ["-0.30901703238487244", "0.9510564804077148", 0],
                ["-0.8090170621871948", "0.5877851843833923", 0],
                [0, 0, -3],
                ["-1", "-8.742277657347586e-8", 0],
                ["-0.8090169429779053", "-0.5877853631973267", 0],
                [0, 0, -3],
                ["-0.3090170919895172", "-0.9510564804077148", 0],
                ["0.3090171217918396", "-0.9510564804077148", 0],
                [0, 0, -3],
            ]
        }),
        colors: bb.zeros({ shape: [12, 3] }).assign({ with: bb.rand({ shape: [3] }) }),
        sizes: bb.ones({ shape: [12, 1] }).multiply({ with: 10 }),
        mode: 'TRIANGLES'
    })
})()

