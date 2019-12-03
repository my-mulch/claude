import bb from '../../big-box/index.mjs'
import Circle from './circle.mjs'
import Primitive from './index.mjs'

export default class Cylinder extends Primitive {
    constructor({ radius = 1, height = 1, center }) {
        super(center)

        this.height = height
        this.radius = radius

        this.top = new Circle({
            radius: this.radius,
            center: this.center
                .slice({ region: [':', ':3'] })
                .add({ with: [0, 0, this.height / 2] })
        })

        this.base = new Circle({
            radius: this.radius,
            center: this.center
                .slice({ region: [':', ':3'] })
                .subtract({ with: [0, 0, this.height / 2] })
        })

        this.points = bb
            .zeros({ shape: [Primitive.VERTEX_COUNT * 2, 3] })
            .assign({ region: ['::2'], with: this.base.points })
            .assign({ region: ['1::2'], with: this.top.points })
    }

    render() {
        return {
            vertices: this.points,
            colors: bb.ones({ shape: this.points.shape }),
            sizes: bb.ones({ shape: this.points.shape }),
            mode: 'TRIANGLE_STRIP',
        }
    }
}
