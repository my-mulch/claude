import Mouse from './peripherals/mouse'
import Keyboard from './peripherals/keyboard'

import WebGLManager from './managers/webgl'
import CameraManager from './managers/camera'

import config from './resources'

class ParmesanApplication {
    constructor() {
        /** Integrate configuration */
        Object.assign(this, config)

        /** To Draw */
        this.objects = []

        /** Displays */
        this.resize()

        /** Managers */
        this.webgl = new WebGLManager()
        this.camera = new CameraManager()

        /** Graphics Operations */
        this.pan = this.pan.bind(this)
        this.zoom = this.zoom.bind(this)
        this.plot = this.plot.bind(this)
        this.start = this.start.bind(this)
        this.render = this.render.bind(this)

        /** Input, Output */
        this.keyup = this.keyup.bind(this)
        this.resize = this.resize.bind(this)
        this.keydown = this.keydown.bind(this)
        this.mouseup = this.mouseup.bind(this)
        this.mousedown = this.mousedown.bind(this)
        this.mousemove = this.mousemove.bind(this)

        /** Peripherals */
        this.mouse = new Mouse()
        this.keyboard = new Keyboard(this.BINDINGS)

        /** Event Listeners */
        window.addEventListener('resize', this.resize)
        window.addEventListener('keyup', this.keyup)
        window.addEventListener('keydown', this.keydown)
        window.addEventListener('mouseup', this.mouseup)
        window.addEventListener('mousedown', this.mousedown)
        window.addEventListener('mousemove', this.mousemove)
    }

    mouseup() { this.mouse.mouseup() }
    mousedown(event) { this.mouse.mousedown(event) }
    mousemove(event) { this.mouse.mousemove(event) }

    keyup() { this.keyboard.keyup() }

    keydown(event) {
        const binding = this.keyboard.keydown(event)

        if (binding) {
            event.preventDefault()

            this[binding.name].call(null, binding.args)
        }
    }

    resize() {
        this.CANVAS.width = window.innerWidth
        this.CANVAS.height = window.innerHeight

        this.HUD.width = window.innerWidth * 0.5
        this.HUD.height = window.innerHeight * 0.2

        this.ASPECT_RATIO = this.CANVAS.width / this.CANVAS.height
    }

    plot({ vertices, colors, sizes, mode }) {
        this.objects.push({
            sizeBuffer: this.webgl.createBuffer(sizes),
            colorBuffer: this.webgl.createBuffer(colors),
            vertexBuffer: this.webgl.createBuffer(vertices),

            drawMode: this.webgl.CONTEXT[mode],
            drawCount: vertices.shape[0]
        })

        this.render()
    }

    render() {
        this.webgl.CONTEXT.clear(this.webgl.CONTEXT.COLOR_BUFFER_BIT)

        for (const object of this.objects) {

            this.webgl.attributes.a_Color(object.colorBuffer)
            this.webgl.attributes.a_PointSize(object.sizeBuffer)
            this.webgl.attributes.a_Position(object.vertexBuffer)

            this.webgl.uniforms.u_ViewMatrix(this.camera.look())
            this.webgl.uniforms.u_ProjMatrix(this.camera.project())


            this.webgl.CONTEXT.drawArrays(object.drawMode, 0, object.drawCount)
        }
    }

    pan(direction) {
        this.camera.pan(direction)
        this.render()
    }

    zoom(zoomOut) {
        this.camera.zoom(zoomOut)
        this.render()
    }
}

export default new ParmesanApplication()
