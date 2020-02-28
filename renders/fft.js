import Scene from '../scene/index.mjs'
import Sketch from '../sketch/index.mjs'

export default async function main() {
    this.scene = new Scene()

    this.sketch = new Sketch(scene.canvas, {
        fragment: [
            "#ifdef GL_ES",
            "precision highp float;",
            "#endif",
            "uniform float u_time;",
            "void main() {",
            "  gl_FragColor = vec4(cos(u_time / 1000.), cos(u_time / 500.), cos(u_time / 250.), 1.0);",
            "}"
        ].join('\n'),
        vertex: [
            "attribute vec4 a_Position;",
            "uniform float u_time;",
            "void main() {",
            "  gl_PointSize = 100.;",
            "  gl_Position = vec4(cos(u_time / 1000.), sin(u_time / 1000.), 0., 1.0);",
            "}"
        ].join('\n')
    })

    sketch.animate(function (time) {
        sketch.u_time(time)

        sketch.draw({ mode: sketch.context.POINTS, count: 1 })
    })
}
