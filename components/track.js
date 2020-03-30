import Component from './index.js'

import Camera from '../tools/camera.js'
import Renderer from '../tools/renderer.js'
import Trackball from '../tools/trackball.js'

export default class TrackballView extends Component {
    static shaders = {
        fragment: [
            'precision mediump float;',
            'varying vec4 v_Color;',
            'void main() { gl_FragColor = v_Color; }'
        ].join('\n'),
        vertex: [
            'attribute float a_PointSize;',
            'attribute vec4 a_Position;',
            'attribute vec4 a_Color;',

            'uniform mat4 u_ViewMatrix;',
            'uniform mat4 u_ProjMatrix;',
            'uniform mat4 u_ModelMatrix;',

            'varying vec4 v_Color;',

            'void main() {',
            '  gl_PointSize = a_PointSize;',
            '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;',
            '  v_Color = a_Color;',
            '}',
        ].join('\n')
    }

    constructor() {
        /** Super */
        super()

        /** Display */
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.context = this.canvas.getContext('webgl')

        /** Tools */
        this.pointer = false
        this.camera = new Camera({})
        this.trackball = new Trackball({})
        this.renderer = new Renderer({
            vertex: TrackballView.shaders.vertex,
            fragment: TrackballView.shaders.fragment,
            context: this.context,
        })

        /** Event Listeners */
        this.canvas.addEventListener(this.wheel.name, this.wheel.bind(this))
        this.canvas.addEventListener(this.pointerup.name, this.pointerup.bind(this))
        this.canvas.addEventListener(this.pointermove.name, this.pointermove.bind(this))
        this.canvas.addEventListener(this.pointerdown.name, this.pointerdown.bind(this))
    }

    render() { /** Implemented by Subclass */ }

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
        const [x, y] = this.rasterToScreen(event.offsetX, event.offsetY)

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
        const [x, y] = this.rasterToScreen(event.offsetX, event.offsetY)

        /** Cast a Ray using Screen-Space Coordinates */
        const ray = this.camera.cast(x, y)

        /** Point of Intersection */
        const point = this.trackball.intersect(ray)

        /** Track the Mouse-Movement along the Trackball */
        this.trackball.track(point)

        /** Render */
        this.render()
    }

    pointerup() {
        /** Released */
        this.pointer = false

        /** Keep the Trackball at the Released Position */
        this.trackball.pause()
    }
}
