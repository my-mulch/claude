import BufferManager from './managers/buffer'
import CameraManager from './managers/camera'
import ProgramManager from './managers/program'
import UniformManager from './managers/uniform'
import AttributeManager from './managers/attribute'

import config from '../resources'

export default class GraphicsEngine3D {
    constructor() {
        this.config = config
        this.objects = []

        this.pan = this.pan.bind(this)
        this.zoom = this.zoom.bind(this)
        this.plot = this.plot.bind(this)
        this.start = this.start.bind(this)
        this.render = this.render.bind(this)

        this.start()
    }

    start() {
        this.hud = document.createElement('canvas')
        this.hud.style.zIndex = this.config.HUD_Z_INDEX
        this.hud.style.position = this.config.HUD_POSITION_STYLE

        this.canvas = document.createElement('canvas')
        this.canvas.style.zIndex = this.config.CANVAS_Z_INDEX
        this.canvas.style.position = this.config.CANVAS_POSITION_STYLE

        this.resize() /** Must resize before grabbing context */

        this.canvas.context = this.canvas.getContext(this.config.CONTEXT_WEB_GL)

        this.cameraManager = new CameraManager({})
        this.bufferManager = new BufferManager({ context: this.canvas.context })
        this.programManager = new ProgramManager({ context: this.canvas.context })
        this.uniformManager = new UniformManager({ context: this.canvas.context, program: this.programManager.program })
        this.attributeManager = new AttributeManager({ context: this.canvas.context, program: this.programManager.program })

        this.canvas.context.useProgram(this.programManager.program)

        this.hud.context = this.hud.getContext(this.config.CONTEXT_2D)
        this.hud.context.font = this.config.HUD_FONT
        this.hud.context.fillStyle = this.config.HUD_COLOR

        document.body.prepend(this.hud)
        document.body.prepend(this.canvas)

        return this
    }

    resize() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        this.hud.width = window.innerWidth * 0.5
        this.hud.height = window.innerHeight * 0.2

        this.config.ASPECT_RATIO = this.canvas.width / this.canvas.height
    }

    plot({ vertices, colors, sizes, mode }) {
        this.objects.push({
            sizeBuffer: this.bufferManager.createBuffer({ array: sizes }),
            colorBuffer: this.bufferManager.createBuffer({ array: colors }),
            vertexBuffer: this.bufferManager.createBuffer({ array: vertices }),

            drawMode: this.canvas.context[mode],
            drawCount: vertices.shape[0]
        })

        this.render()
    }

    render() {
        this.canvas.context.clear(this.canvas.context.COLOR_BUFFER_BIT)

        for (const object of this.objects) {

            this.attributeManager.attributes.a_Color(object.colorBuffer)
            this.attributeManager.attributes.a_PointSize(object.sizeBuffer)
            this.attributeManager.attributes.a_Position(object.vertexBuffer)

            this.uniformManager.uniforms.u_ViewMatrix(this.cameraManager.lookAt())
            this.uniformManager.uniforms.u_ProjMatrix(this.cameraManager.project())


            this.canvas.context.drawArrays(object.drawMode, 0, object.drawCount)
        }
    }

    pan(direction) {
        this.cameraManager.pan(direction)
        this.render()
    }

    zoom(zoomOut) {
        this.cameraManager.zoom(zoomOut)

        this.hud.context.clearRect(0, 0, this.hud.width, this.hud.height)
        this.hud.context.fillText(`loc | r: ${Math.round(this.config.FROM_VECTOR.data.real[0])} g: ${Math.round(this.config.FROM_VECTOR.data.real[1])}, b: ${Math.round(this.config.FROM_VECTOR.data.real[2])}`, 10, 70)

        this.render()
    }

}

