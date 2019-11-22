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
    // app.plot(circle)
    app.plot(grid(1.2e2))
    // app.plot(box)
})()
