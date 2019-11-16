import myio from './myio'
import bb from './big-box'
import parmesan from './parmesan'
import config from './parmesan/resources'

import { axes, points, circle, rgb, imageCube } from './examples'

window.bb = bb
window.myio = myio
window.app = parmesan
window.config = config

export default (async function () {
    // app.plot(await imageCube('http://localhost:3000/Users/trumanpurnell/Pictures/11233270_1146995038650978_3611923540576057298_o.jpg'))
    app.plot(axes)
    app.plot(rgb)
    app.plot(circle)
    app.plot(points)
})()
