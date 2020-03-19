import Camera from 'ansel'
import Renderer from 'guten'
import Trackball from 'engelbart'

import Shaders from './shade.js'

export default class TrackScene {
    constructor({ positions, sizes, colors }) {
        /** Display */
        this.canvas = document.createElement('canvas')

        /** Tools */
        this.pointer = false
        this.camera = new Camera({})
        this.trackball = new Trackball({})

        this.renderer = new Renderer({
            /** Setup */
            vertex: Shaders.vertex,
            fragment: Shaders.fragment,
            context: this.canvas.context('webgl'),

            /** Data */
            sizes,
            colors,
            positions,
        })



        const sizeBuffer = sketch.buffer({ array: size })
        const colorBuffer = sketch.buffer({ array: color })
        const positionBuffer = sketch.buffer({ array: image })


        /** Event Listeners */
        this.canvas.addEventListener(this.wheel.name, this.wheel.bind(this))
        this.canvas.addEventListener(this.resize.name, this.resize.bind(this))
        this.canvas.addEventListener(this.pointerup.name, this.pointerup.bind(this))
        this.canvas.addEventListener(this.pointermove.name, this.pointermove.bind(this))
        this.canvas.addEventListener(this.pointerdown.name, this.pointerdown.bind(this))
    }

    render() {
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

    resize(event) { }

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
