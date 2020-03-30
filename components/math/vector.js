import VectorSpace from '../shapes/vectors.js'
import TrackballView from '../track.js'

export default class VectorView extends TrackballView {
    constructor({ basis }) {
        /** Super */
        super()

        /** Space */
        this.basis = basis
        this.vectorSpace = new VectorSpace({ basis })
        this.standardSpace = new VectorSpace({})

        /** Buffer */
        this.positions = new Float32Array(
            this.vectorSpace.vertices.length +
            this.standardSpace.vertices.length
        )

        const sizes = this.positions

        const colors = new Float32Array(this.positions.length)

        debugger

        for (let i = 0; i < this.standardSpace.vertices.length; i += 3) {
            colors[i + 0] = 0
            colors[i + 1] = 1
            colors[i + 2] = 0
        }

        for (let i = this.standardSpace.vertices.length; i < this.positions.length; i += 3) {
            colors[i + 0] = 0
            colors[i + 1] = 0
            colors[i + 2] = 1
        }


        this.positions.set(this.standardSpace.vertices)
        this.positions.set(this.vectorSpace.vertices, this.standardSpace.vertices.length)


        this.renderer.a_Color({ buffer: this.renderer.buffer({ array: colors }), size: 3 })
        this.renderer.a_PointSize({ buffer: this.renderer.buffer({ array: sizes }), size: 1 })
        this.renderer.a_Position({ buffer: this.renderer.buffer({ array: this.positions }), size: 3 })

        this.renderer.u_ProjMatrix(this.camera.proj)

        this.render()
    }

    render() {
        this.renderer.u_ViewMatrix(this.camera.view)
        this.renderer.u_ModelMatrix(this.trackball.model)

        this.renderer.draw({ mode: this.renderer.context.TRIANGLES, count: this.positions.length / 3 })
    }
}
