import TrackballView from '../track.js'

export default class RGBView extends TrackballView {
    render(region) {
        if (region) {
            const colors = region.slice()
            const positions = region
            const sizes = new Float32Array(positions.length / 3).fill(10)

            for (let i = 0; i < region.length; i++)
                positions[i] -= 0.5

            this.renderer.a_Color({ buffer: this.renderer.buffer({ array: colors }), size: 3 })
            this.renderer.a_PointSize({ buffer: this.renderer.buffer({ array: sizes }), size: 1 })
            this.renderer.a_Position({ buffer: this.renderer.buffer({ array: positions }), size: 3 })
        }

        this.renderer.u_ProjMatrix(this.camera.proj)
        this.renderer.u_ViewMatrix(this.camera.view)
        this.renderer.u_ModelMatrix(this.trackball.model)

        this.renderer.draw({ mode: this.renderer.context.POINTS, count: 75 * 75 })
    }
}
