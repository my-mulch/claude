import myio from './myio'
import bb from './big-box'
import parmesan from './parmesan'

import { axes, points } from './examples'

window.bb = bb
window.myio = myio
window.app = parmesan

export default (async function () {
    app.graphics.plot(points)
    app.graphics.plot(axes)
})()
