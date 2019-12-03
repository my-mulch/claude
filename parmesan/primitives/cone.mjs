import bb from '../../big-box.mjs'
import Primitive from '..mjs'
import Circle from './circle.mjs'

export default class Cone extends Primitive {
    constructor({ radius = 1, height = 1, center }) {
        super(center)

        this.height = height
        this.radius = radius

        this.base = new Circle({
            radius: this.radius,
            center: this.center
        })

        this.points = this.base.points.insert({
            with: [0, 0, this.height],
            axes: [0],
            entries: [0]
        })
    }

    render() {
        return {
            vertices: this.points,
            colors: bb.ones({ shape: this.points.shape }),
            sizes: bb.ones({ shape: this.points.shape }),
            mode: 'TRIANGLE_FAN',
        }
    }
}
