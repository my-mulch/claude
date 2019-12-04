import bb from './big-box/index.mjs'
import myio from './myio/index.mjs'
import parmesan from './parmesan/index.mjs'
import config from './parmesan/resources/index.mjs'

import Sound from './parmesan/primitives/sound.mjs'
import Cube from './parmesan/primitives/cube.mjs'
import Axes from './parmesan/primitives/axes.mjs'
import Grid from './parmesan/primitives/grid.mjs'
import Cone from './parmesan/primitives/cone.mjs'
import Vector from './parmesan/primitives/vector.mjs'
import Circle from './parmesan/primitives/circle.mjs'
import RGBCube from './parmesan/primitives/rgbCube.mjs'
import Cylinder from './parmesan/primitives/cylinder.mjs'
import ImageCube from './parmesan/primitives/imageCube.mjs'
import Primitive from './parmesan/primitives/index.mjs'

import Header from './big-box/header/index.mjs'

window.bb = bb
window.myio = myio
window.app = parmesan
window.config = config

window.Cylinder = Cylinder

    ; (async function () {
        app.plot(await new Sound({ path: 'http://localhost:3000/Users/trumanpurnell/Music/PinkPanther60.wav' }).render())

        // app.plot(new Cylinder({ height: 2, radius: 0.1 }).render())
        app.plot(new Cylinder({ height: 2, radius: 1 }).render())

        // for (let i = -75; i < 75; i++)
        //     for (let j = -75; j < 75; j++)
        //         for (let k = -75; k < 75; k++)
        //             bb.tensor({ data: [[1], [1], [1]] })
        // new Header({ shape: [3, 1] })


        // app.plot(new Circle({ radius: 0.1, center: [[i, j, k]] }).render())

        app.plot(new Axes({ length: 5 }).render())
        app.plot(new Cube({}).render())
        app.plot(await new ImageCube({ path: 'http://localhost:3000/Users/trumanpurnell/Pictures/IMG_6721.jpg' }).render())
        app.plot(new RGBCube({}).render())
        app.plot(new Circle({}).render())

        app.render()
    })()



