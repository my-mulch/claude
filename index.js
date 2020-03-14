import io from './io/index.js'
import Scene from './scene/index.js'
import Sketch from './sketch/index.js'

export default async function main() {
    /** Inits -- function is scoped to window */
    this.io = io
    this.scene = new Scene()
    this.sketch = new Sketch(scene.canvas, {
        fragment: await io.txtread('./sketch/shaders/main.frag'),
        vertex: await io.txtread('./sketch/shaders/main.vert')
    })

    const image = await io.imread('./assets/img/sea.jpg')
    const color = image.slice()
    const pixels = image.length / 3
    const size = new Float32Array(pixels).fill(1)

    for (let i = 0; i < image.length; i += 3) {
        image[i + 0] -= 0.5
        image[i + 1] -= 0.5
        image[i + 2] -= 0.5
    }

    const sizeBuffer = sketch.buffer({ array: size })
    const colorBuffer = sketch.buffer({ array: color })
    const positionBuffer = sketch.buffer({ array: image })

    sketch.animate(function () {
        sketch.a_Color({ buffer: colorBuffer, size: 3 })
        sketch.a_PointSize({ buffer: sizeBuffer, size: 1 })
        sketch.a_Position({ buffer: positionBuffer, size: 3 })

        sketch.u_ProjMatrix(scene.camera.proj)
        sketch.u_ViewMatrix(scene.camera.view)
        sketch.u_ModelMatrix(scene.trackball.model)

        sketch.draw({ mode: sketch.context.POINTS, count: pixels })
    })

}
