import bb from '../bb/index.mjs'
import Engine from './engine.mjs'
import Camera from './camera.mjs'
import config from '../res/config.mjs'

export default class Cow {
    constructor(vertex, fragment) {
        /** Objects */
        this.objects = []

        /** Display */
        this.canvas = document.getElementById('main')

        /** Configuration */
        config.UP = bb.tensor(config.UP)
        config.TO = bb.tensor(config.TO)
        config.FROM = bb.tensor(config.FROM)

        config.LOOK_MATRIX = bb.tensor(config.LOOK_MATRIX)
        config.VIEW_MATRIX = bb.tensor(config.VIEW_MATRIX)
        config.MOVE_MATRIX = bb.tensor(config.MOVE_MATRIX)
        config.PROJ_MATRIX = bb.tensor(config.PROJ_MATRIX)

        /** Size */
        this.resize()

        /** Peripherals */
        this.webgl = new Engine(this.canvas, vertex, fragment)
        this.camera = new Camera()

        /** State */
        this.pointerIsDown = false

        // this.last = bb.tensor([1, 0, 0, 0])
        this.pointer = bb.tensor([0, 0, 0, 0])
        this.rotation = bb.tensor([1, 0, 0, 0])

        this.matrix = bb.eye([4, 4])
        this.webgl.uniforms.u_ModelMatrix.set(this.matrix)

        this.rotate = new bb.cached.multiply({
            of: this.pointer,
            with: this.rotation,
            result: this.rotation
        })

        /** Intersection */


        /** Event Listeners */
        this.canvas.addEventListener('wheel', this.wheel.bind(this))
        this.canvas.addEventListener('pointerup', this.pointerup.bind(this))
        this.canvas.addEventListener('pointermove', this.pointermove.bind(this))
        this.canvas.addEventListener('pointerdown', this.pointerdown.bind(this))
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

        for (const object of this.objects) {
            this.webgl.attributes.a_Color.set(object.colorBuffer)
            this.webgl.attributes.a_PointSize.set(object.sizeBuffer)
            this.webgl.attributes.a_Position.set(object.vertexBuffer)

            this.webgl.uniforms.u_ModelMatrix.set(this.matrix)
            this.webgl.uniforms.u_ViewMatrix.set(this.camera.look())
            this.webgl.uniforms.u_ProjMatrix.set(this.camera.project())

            this.webgl.context.drawArrays(object.drawMode, 0, object.drawCount)
        }
    }

    wheel(event) {
        event.preventDefault()

        this.camera.zoom(event.deltaY > 0)

        this.render()
    }

    intersect() {
        const to = config.TO.subtract({
            with: config.FROM
        }).slice([':3'])

        const ro = bb.tensor([
            [[(event.x - this.canvas.width / 2) / this.canvas.width]],
            [[(this.canvas.height / 2 - event.y) / this.canvas.height]],
            [[-to.norm().data[0]]]
        ]).unit()

        const r = 1
        const t = to.T().matMult({ with: ro }).data[0]
        const z = ro.multiply({ with: t }).subtract({ with: config.FROM.slice([':3']).negate() }).norm().data[0]
        const x = Math.sqrt(r ** 2 - z ** 2)
        const i = ro.multiply({ with: t - x })
        i.data[2] *= -1

        return i
    }

    pointerdown(event) {
        /** Clicked */
        this.pointerIsDown = true

        this.v1 = this.intersect()
    }

    pointermove(event) {
        if (!this.pointerIsDown) return

        this.v2 = this.intersect()

        this.v = bb.cross({ of: this.v1, with: this.v2 }).unit()
        this.d = this.v1.T().matMult({ with: this.v2 }).data[0]
        this.n = this.v1.norm().data[0] * this.v2.norm().data[0]
        this.a = Math.acos(this.d / this.n)

        this.pointer.data[0] = Math.cos(this.a / 2)
        this.pointer.data[1] = Math.sin(this.a / 2) * this.v.data[0]
        this.pointer.data[2] = Math.sin(this.a / 2) * this.v.data[1]
        this.pointer.data[3] = Math.sin(this.a / 2) * this.v.data[2]

        this.rotate.invoke()
        
        // debugger

        const qw = this.rotation.data[0]
        const qx = -this.rotation.data[1]
        const qy = -this.rotation.data[2]
        const qz = -this.rotation.data[3]

        console.log(qw ** 2 + qx ** 2 + qy ** 2 + qz ** 2)

        this.matrix.data[0] = 1.0 - 2.0 * qy * qy - 2.0 * qz * qz
        this.matrix.data[1] = 2.0 * qx * qy - 2.0 * qz * qw
        this.matrix.data[2] = 2.0 * qx * qz + 2.0 * qy * qw
        this.matrix.data[3] = 0.0

        this.matrix.data[4] = 2.0 * qx * qy + 2.0 * qz * qw
        this.matrix.data[5] = 1.0 - 2.0 * qx * qx - 2.0 * qz * qz
        this.matrix.data[6] = 2.0 * qy * qz - 2.0 * qx * qw
        this.matrix.data[7] = 0.0

        this.matrix.data[8] = 2.0 * qx * qz - 2.0 * qy * qw
        this.matrix.data[9] = 2.0 * qy * qz + 2.0 * qx * qw
        this.matrix.data[10] = 1.0 - 2.0 * qx * qx - 2.0 * qy * qy
        this.matrix.data[11] = 0.0

        this.matrix.data[12] = 0
        this.matrix.data[13] = 0
        this.matrix.data[14] = 0
        this.matrix.data[15] = 1.0

        this.render()
    }

    pointerup() {
        this.pointerIsDown = false
    }

    resize() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        config.ASPECT_RATIO = this.canvas.width / this.canvas.height
    }
}
        // this.pointer.data[0] = 0
        // this.pointer.data[1] = (event.x - this.canvas.width / 2) / this.canvas.width
        // this.pointer.data[2] = (this.canvas.height / 2 - event.y) / this.canvas.height
        // this.pointer.data[3] = Math.sqrt(1 - this.pointer.data[0] ** 2 - this.pointer.data[1] ** 2)