import Engine from '../graphics/engine.mjs'
import Camera from '../graphics/camera.mjs'
import Trackball from '../graphics/trackball.mjs'

class Cow {
    constructor(canvas = document.getElementById('main')) {
        /** Scene */
        this.drawables = []

        /** Display */
        this.canvas = canvas
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        /** Peripherals */
        this.pointer = false
        this.engine = new Engine(this.canvas)
        this.camera = new Camera(this.canvas.width / this.canvas.height)
        this.trackball = new Trackball()

        /** Event State */

        /** Event Listeners */
        this.canvas.addEventListener('wheel', this.wheel.bind(this))
        this.canvas.addEventListener('pointerup', this.pointerup.bind(this))
        this.canvas.addEventListener('pointermove', this.pointermove.bind(this))
        this.canvas.addEventListener('pointerdown', this.pointerdown.bind(this))
    }

    plot({ vertices, colors, sizes, mode }) {
        this.drawables.push({
            sizeBuffer: this.engine.createBuffer(sizes),
            colorBuffer: this.engine.createBuffer(colors),
            vertexBuffer: this.engine.createBuffer(vertices),

            drawMode: mode,
            drawCount: vertices.header.shape[0]
        })
    }

    render() {
        this.engine.context.clear(this.engine.context.COLOR_BUFFER_BIT)

        for (const object of this.drawables) {
            this.engine.attributes.a_Color.set(object.colorBuffer)
            this.engine.attributes.a_PointSize.set(object.sizeBuffer)
            this.engine.attributes.a_Position.set(object.vertexBuffer)

            this.engine.uniforms.u_ViewMatrix.set(this.camera.view)
            this.engine.uniforms.u_ProjMatrix.set(this.camera.proj)
            this.engine.uniforms.u_ModelMatrix.set(this.trackball.model)

            this.engine.context.drawArrays(object.drawMode, 0, object.drawCount)
        }
    }

    wheel(event) {
        if (!event.ctrlKey) return

        event.preventDefault()

        this.camera.zoom(event.deltaY)

        this.render()
    }

    rasterToScreen(x, y) {
        /** Convert Raster-Space Coordinates to Screen-Space */
        return [
            2 * x / this.canvas.width - 1,
            1 - 2 * y / this.canvas.height,
        ]
    }

    pointerdown(event) {
        /** Pressed */
        this.pointer = true

        /** Convert Click to Screen-Space Coordinates */
        const [x, y] = this.rasterToScreen(event.x, event.y)

        /** Cast a Ray using Screen-Space Coordinates */
        const ray = this.camera.cast(x, y)

        /** Point of Intersection */
        const point = this.trackball.intersect(ray)

        /** Start the Trackball */
        this.trackball.play(point)
    }

    pointermove(event) {
        /** Not Pressed? */
        if (!this.pointer) return

        /** Convert Click to Screen-Space Coordinates */
        const [x, y] = this.rasterToScreen(event.x, event.y)

        /** Cast a Ray using Screen-Space Coordinates */
        const ray = this.camera.cast(x, y)

        /** Point of Intersection */
        const point = this.trackball.intersect(ray)

        /** Track the Mouse-Movement along the Trackball */
        this.trackball.track(point)

        /** Render the Changes */
        this.render()
    }

    pointerup() {
        /** Released */
        this.pointer = false

        /** Keep the Trackball at the Released Position */
        this.trackball.pause()
    }
}

export default new Cow()
