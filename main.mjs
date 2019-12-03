import bb from './big-box/index.mjs'
import myio from './myio/index.mjs'
import parmesan from './parmesan/index.mjs'

import config from './parmesan/resources/index.mjs'
import Axes from './parmesan/primitives/axes.mjs'
import Cone from './parmesan/primitives/cone.mjs'
import Circle from './parmesan/primitives/circle.mjs'
import Cylinder from './parmesan/primitives/cylinder.mjs'

window.bb = bb
window.myio = myio
window.app = parmesan
window.config = config

// app.plot(await soundWave('http://localhost:3000/Users/trumanpurnell/Music/PinkPanther60.wav'))
// app.plot(await imageCube('http://localhost:3000/Users/trumanpurnell/Pictures/68828786_10217017620425433_2350853209913819136_o.jpg'))
// app.plot(circle)
// app.plot(grid(10))

app.plot(new Cone({ height: 10 }).render())
// app.plot(new Cylinder({ height: 2 }).render())

app.plot(new Axes({ length: 5 }).render())
    // app.plot(new Circle({ center: [[0, 0, 0, 1]] }).render())
    // app.plot(new Circle({ center: [[0, 0, 1, 1]] }).render())
    // app.plot(new Circle({ center: [[0, 1, 0, 1]] }).render())
    // app.plot(new Circle({ center: [[1, 0, 0, 1]] }).render())

    // for (let i = 0; i < 10; i++)
    //     for (let j = 0; j < 10; j++)
    //         for (let k = 0; k < 10; k++)
    //             app.plot(...vector(i, j, k))
    // console.log(i * 9 + j * 3 + k)

    // app.plot(box)
    // app.plot(rgb)
    // app.plot(axes)


