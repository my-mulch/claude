import bb from './big-box/index.mjs'
import myio from './myio/index.mjs'
import parmesan from './parmesan/index.mjs'
import config from './parmesan/resources/index.mjs'

window.bb = bb
window.myio = myio
window.app = parmesan
window.config = config

import program from './parmesan/managers/webgl/programs/first/index.mjs'

    ; (async function () {

        program()

    })()



