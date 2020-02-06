import Scene from './scene/index.mjs'
import Sketch from './sketch/index.mjs'

export default async function main() {
    this.scene = new Scene()

    this.sketch = new Sketch(scene.canvas,
        await (await fetch('./sketch/shaders/crack/.vert')).text(),
        await (await fetch('./sketch/shaders/crack/.frag')).text())

    const buffer = sketch.buffer({
        target: sketch.context.ARRAY_BUFFER,
        style: sketch.context.STATIC_DRAW,
        array: new Float32Array([1., 1., -1., 1., -1., -1., -1., -1., 1., 1., 1., -1.]),
    })

    sketch.a_Position({
        buffer,
        size: 2,
        type: sketch.context.FLOAT,
        offset: 0,
        stride: 0,
    })

    sketch.u_ProjMatrix(scene.camera.proj)
    
    sketch.animate(function (time) {
        sketch.u_time(time)

        sketch.u_ViewMatrix(scene.camera.view)
        sketch.u_ModelMatrix(scene.trackball.model)

        sketch.draw({ mode: sketch.context.TRIANGLES, count: 6 })
    })
}
