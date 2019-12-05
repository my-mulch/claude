import bb from '../../big-box/index.mjs'
import Circle from './circle.mjs'
import Primitive from './index.mjs'

export default class Cone extends Primitive {
    constructor({ radius = 1, height = 1, center }) {
        super(center)

        this.height = height
        this.radius = radius

        this.base = new Circle({ radius: this.radius, center: this.center })
        this.points = this.base.points.insert({ with: this.center.add({ with: [[[0], [0], this.height]] }), axes: [0], entries: [0] })
    }

    render() {
        return [{
            vertices: this.points,
            colors: bb.ones(this.points.header.shape),
            sizes: bb.ones(this.points.header.shape),
            mode: 'TRIANGLE_FAN',
        }]
    }
}
