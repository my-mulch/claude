import Cone from './cone.mjs'
import Circle from './circle.mjs'
import Cylinder from './cylinder.mjs'
import Primitive from './index.mjs'

export default class Vector extends Primitive {
    constructor({ center }) {
        super(center)

        this.tip = new Cone({ radius: 0.3 / 10, height: 0.5 / 10, center })
        this.ring = new Circle({ radius: 0.3 / 10, center })
        this.base = new Cylinder({ radius: 0.12 / 10, height: 0.5 / 10, center: this.center.subtract({ with: [[[0], [0], [0.25 / 10]]] }) })
    }

    render() {
        return [
            ...this.base.render(),
            ...this.ring.render(),
            ...this.tip.render(),
        ]
    }
}

