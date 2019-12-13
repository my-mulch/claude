import bb from '../big-box/index.mjs'
import WebGL from '../webgl/index.mjs'
import config from '../resources.mjs'

import Mouse from './peripherals/mouse.mjs'
import Camera from './peripherals/camera.mjs'
import Keyboard from './peripherals/keyboard.mjs'

export default class Parmesan {
    constructor(vertex, fragment) {
        /** Objects */
        this.objects = []

        /** Display */
        this.canvas = document.getElementById('main')

        /** configuration */
        config.UP = bb.tensor(config.UP)
        config.TO = bb.tensor(config.TO)
        config.FROM = bb.tensor(config.FROM)

        config.LOOK_MATRIX = bb.tensor(config.LOOK_MATRIX)
        config.VIEW_MATRIX = bb.tensor(config.VIEW_MATRIX)
        config.MOVE_MATRIX = bb.tensor(config.MOVE_MATRIX)
        config.PROJ_MATRIX = bb.tensor(config.PROJ_MATRIX)

        /** Resize */
        this.resize()

        /** Peripherals */
        this.mouse = new Mouse()
        this.camera = new Camera()
        this.webgl = new WebGL(this.canvas, vertex, fragment)
        this.keyboard = new Keyboard(config.BINDINGS)

        /** Event Listeners */
        window.addEventListener('keyup', this.keyup.bind(this))
        window.addEventListener('resize', this.resize.bind(this))
        window.addEventListener('keydown', this.keydown.bind(this))
    }

    plot(objects) {
        for (let { vertices, colors, sizes, mode } of objects) {
            if (!mode) mode = this.webgl.context.POINTS
            if (!sizes) sizes = bb.ones(vertices.header.shape)
            if (!colors) colors = vertices

            this.objects.push({
                sizeBuffer: this.webgl.createBuffer(sizes),
                colorBuffer: this.webgl.createBuffer(colors),
                vertexBuffer: this.webgl.createBuffer(vertices),

                drawMode: this.webgl.context[mode],
                drawCount: vertices.header.shape[0]
            })
        }
    }

    render() {
        this.webgl.context.clear(this.webgl.context.COLOR_BUFFER_BIT)
        
        console.time('rendering')

        for (const object of this.objects) {

            this.webgl.attributes.a_Color.set(object.colorBuffer)
            this.webgl.attributes.a_PointSize.set(object.sizeBuffer)
            this.webgl.attributes.a_Position.set(object.vertexBuffer)

            this.webgl.uniforms.u_ViewMatrix.set(this.camera.look())
            this.webgl.uniforms.u_ProjMatrix.set(this.camera.project())


            this.webgl.context.drawArrays(object.drawMode, 0, object.drawCount)
        }

        console.timeEnd('rendering')
    }

    keyup() {
        this.keyboard.keyup()
    }

    keydown(event) {
        const binding = this.keyboard.keydown(event)

        if (binding) {
            event.preventDefault()
            this.camera[binding.name](...binding.args)
            this.render()
        }
    }

    resize() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        config.ASPECT_RATIO = this.canvas.width / this.canvas.height
    }
}
