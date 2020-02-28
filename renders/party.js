import Scene from '../scene/index.mjs'
import Sketch from '../sketch/index.mjs'

export default async function main() {
    this.scene = new Scene()

    this.sketch = new Sketch(scene.canvas, {
        fragment: [
            "#ifdef GL_ES",
            "precision mediump float;",
            "#endif",
            "uniform float u_time;",
            "void main() {",
            "  gl_FragColor = vec4(sin(u_time / 300.), sin(u_time / 150.), sin(u_time / 75.), 1.0);",
            "}"
        ].join('\n'),
        vertex: [
            "attribute vec4 a_Position;",
            "uniform mat4 u_ViewMatrix;",
            "uniform mat4 u_ProjMatrix;",
            "uniform mat4 u_ModelMatrix;",
            "void main() {",
            "  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;",
            "}"
        ].join('\n')
    })

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
