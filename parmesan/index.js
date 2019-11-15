import Mouse from './peripherals/mouse'
import Keyboard from './peripherals/keyboard'

import config from './resources'

class ParmesanApplication {
    constructor() {
        Object.assign(this, config)

        /** To Draw */
        this.objects = []

        /** Displays */
        this.resize()
        document.body.prepend(this.HUD)
        document.body.prepend(this.CANVAS)

        /** Managers */
        this.webGLManager = new WebGLManager()
        this.cameraManager = new CameraManager()

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
        this.mouse = new Mouse({ x: 0, y: 0 })
        this.keyboard = new Keyboard(this.config.BINDINGS)

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

            const command = this.graphics[binding.name]
            command(...binding.args)
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
            sizeBuffer: this.webGLManager.createBuffer(sizes),
            colorBuffer: this.webGLManager.createBuffer(colors),
            vertexBuffer: this.webGLManager.createBuffer(vertices),

            drawMode: this.webGLManager.CONTEXT[mode],
            drawCount: vertices.shape[0]
        })

        this.render()
    }

    render() {
        this.webGLManager.CONTEXT.clear(this.webGLManager.CONTEXT.COLOR_BUFFER_BIT)

        for (const object of this.objects) {

            this.webGLManager.attributes.a_Color(object.colorBuffer)
            this.webGLManager.attributes.a_PointSize(object.sizeBuffer)
            this.webGLManager.attributes.a_Position(object.vertexBuffer)

            this.webGLManager.uniforms.u_ViewMatrix(this.cameraManager.look())
            this.webGLManager.uniforms.u_ProjMatrix(this.cameraManager.project())


            this.webGLManager.CONTEXT.drawArrays(object.drawMode, 0, object.drawCount)
        }
    }

    pan(direction) {
        this.cameraManager.pan(direction)
        this.render()
    }

    zoom(zoomOut) {
        this.cameraManager.zoom(zoomOut)
        this.render()
    }
}

export default new ParmesanApplication()
