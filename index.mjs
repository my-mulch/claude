import myio from './myio'
import bb from './big-box'
import parmesan from './parmesan'

import { axes, points, circle } from './examples'

window.bb = bb
window.myio = myio
window.app = parmesan

export default (async function () {
    app.plot(points)
    app.plot(circle)
    app.plot(axes)
})()
