import BufferManager from './managers/webgl/buffer'
import CameraManager from './managers/camera'
import ProgramManager from './managers/webgl/program'
import UniformManager from './managers/webgl/uniform'
import AttributeManager from './managers/webgl/attribute'

import config from './resources'

export default class GraphicsEngine {
    constructor() {
        Object.assign(this, config)

        this.objects = []

        this.pan = this.pan.bind(this)
        this.zoom = this.zoom.bind(this)
        this.plot = this.plot.bind(this)
        this.start = this.start.bind(this)
        this.render = this.render.bind(this)

        /** Displays */
        this.resize()
        document.body.prepend(this.HUD)
        document.body.prepend(this.CANVAS)
        
        /** Managers */
        this.webGLManager = new WebGLManager(this)
        this.cameraManager = new CameraManager(this)
    }

    start() {

        this.bufferManager = new BufferManager({ context: this.CANVAS.context })
        this.programManager = new ProgramManager({ context: this.CANVAS.context })
        this.uniformManager = new UniformManager({ context: this.CANVAS.context, program: this.programManager.program })
        this.attributeManager = new AttributeManager({ context: this.CANVAS.context, program: this.programManager.program })

        this.CANVAS.context.useProgram(this.programManager.program)

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
            sizeBuffer: this.bufferManager.createBuffer({ array: sizes }),
            colorBuffer: this.bufferManager.createBuffer({ array: colors }),
            vertexBuffer: this.bufferManager.createBuffer({ array: vertices }),

            drawMode: this.CANVAS.context[mode],
            drawCount: vertices.shape[0]
        })

        this.render()
    }

    render() {
        this.CANVAS.context.clear(this.CANVAS.context.COLOR_BUFFER_BIT)

        for (const object of this.objects) {

            this.attributeManager.attributes.a_Color(object.colorBuffer)
            this.attributeManager.attributes.a_PointSize(object.sizeBuffer)
            this.attributeManager.attributes.a_Position(object.vertexBuffer)

            this.uniformManager.uniforms.u_ViewMatrix(this.cameraManager.lookAt())
            this.uniformManager.uniforms.u_ProjMatrix(this.cameraManager.project())


            this.CANVAS.context.drawArrays(object.drawMode, 0, object.drawCount)
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

