import Camera from './camera.mjs'
import Trackball from './trackball.mjs'

export default class Scene {
    constructor() {
        /** Display */
        this.canvas = document.createElement('canvas')
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        document.body.prepend(this.canvas)

        /** Peripherals */
        this.pointer = false
        this.camera = new Camera(this.canvas.width / this.canvas.height)
        this.trackball = new Trackball()

        /** Event Listeners */
        this.canvas.addEventListener('wheel', this.wheel.bind(this))
        this.canvas.addEventListener('pointerup', this.pointerup.bind(this))
        this.canvas.addEventListener('pointermove', this.pointermove.bind(this))
        this.canvas.addEventListener('pointerdown', this.pointerdown.bind(this))
    }

    wheel(event) {
        if (!event.ctrlKey) return

        event.preventDefault()

        this.camera.zoom(event.deltaY)
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
    }

    pointerup() {
        /** Released */
        this.pointer = false

        /** Keep the Trackball at the Released Position */
        this.trackball.pause()
    }
}
