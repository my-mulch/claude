import bb from '../bb/index.mjs'
import WebGL from './webgl.mjs'
import Camera from './camera.mjs'
import Trackball from './trackball.mjs'

export default class Cow {
    constructor(canvas = document.getElementById('main')) {
        /** State */
        this.pointer = false
        this.drawables = []

        /** Display */
        this.canvas = canvas
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        /** Peripherals */
        this.webgl = new WebGL(this.canvas)
        this.camera = new Camera(this.canvas.width / this.canvas.height)
        this.trackball = new Trackball()

        /** Event Listeners */
        this.canvas.addEventListener('wheel', this.wheel.bind(this))
        this.canvas.addEventListener('pointerup', this.pointerup.bind(this))
        this.canvas.addEventListener('pointermove', this.pointermove.bind(this))
        this.canvas.addEventListener('pointerdown', this.pointerdown.bind(this))
    }

    plot({ vertices, colors, sizes, mode }) {
        if (!mode) mode = this.webgl.context.POINTS
        if (!sizes) sizes = bb.ones(vertices.header.shape)
        if (!colors) colors = vertices

        this.drawables.push({
            sizeBuffer: this.webgl.createBuffer(sizes),
            colorBuffer: this.webgl.createBuffer(colors),
            vertexBuffer: this.webgl.createBuffer(vertices),

            drawMode: mode,
            drawCount: vertices.header.shape[0]
        })
    }

    render() {
        this.webgl.context.clear(this.webgl.context.COLOR_BUFFER_BIT)

        for (const object of this.drawables) {
            this.webgl.attributes.a_Color.set(object.colorBuffer)
            this.webgl.attributes.a_PointSize.set(object.sizeBuffer)
            this.webgl.attributes.a_Position.set(object.vertexBuffer)

            this.webgl.uniforms.u_ModelMatrix.set(new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]))

            this.webgl.uniforms.u_ViewMatrix.set(this.camera.look())
            this.webgl.uniforms.u_ProjMatrix.set(this.camera.proj)

            this.webgl.context.drawArrays(object.drawMode, 0, object.drawCount)
        }
    }

    wheel(event) {
        if (!event.ctrlKey) return

        event.preventDefault()

        this.camera.zoom(event.deltaY)

        this.render()
    }

    pointerdown(event) {
        /** Pressed */
        this.pointer = true

        /** Screen-Space Coordinates */
        const x = 2 * event.x / this.canvas.width - 1
        const y = 1 - 2 * event.y / this.canvas.height

        /** Cast a Ray */
        const ray = this.camera.cast(x, y)

        /** Intersection */
        const [p0, p1] = this.trackball.intersect(
            ray, // Direction of casted ray
            this.camera.from // Origin of casted ray
        )

        this.trackball.start(p0)
    }

    pointermove(event) {
        if (!this.pointer) return
    }

    pointerup(event) {
        /** Released */
        this.pointer = false
    }
}
