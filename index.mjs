import bb from './big-box/index.mjs'
import myio from './myio/index.mjs'
import parmesan from './parmesan/index.mjs'
import config from './parmesan/resources/index.mjs'

import Sound from './parmesan/primitives/sound.mjs'
import ImageCube from './parmesan/primitives/imageCube.mjs'
import RGBCube from './parmesan/primitives/rgbCube.mjs'
import Cube from './parmesan/primitives/cube.mjs'
import Axes from './parmesan/primitives/axes.mjs'
import Grid from './parmesan/primitives/grid.mjs'
import Cone from './parmesan/primitives/cone.mjs'
import Circle from './parmesan/primitives/circle.mjs'
import Cylinder from './parmesan/primitives/cylinder.mjs'

window.bb = bb
window.myio = myio
window.app = parmesan
window.config = config

    ; (async function () {
        // app.plot(await new Sound({ path: 'http://localhost:3000/Users/trumanpurnell/Music/PinkPanther60.wav' }).render())
        // app.plot(new Cone({ height: 3 }).render())
        // app.plot(new Cylinder({ height: 0.1 }).render())
        // app.plot(new Axes({ length: 5 }).render())
        app.plot(new RGBCube({}).render())
        app.plot(new Cube({}).render())
        // app.plot(await new ImageCube({ path: 'http://localhost:3000/Users/trumanpurnell/Pictures/68828786_10217017620425433_2350853209913819136_o.jpg' }).render())
        // app.plot(new Circle({}).render())
    })()





