import bb from '../../big-box/index.mjs'
import Primitive from './index.mjs'

export default class Circle extends Primitive {
    static template = bb
        .linspace({
            start: 0,
            stop: 2 * Math.PI,
            num: Primitive.VERTEX_COUNT
        })
        .multiply({ with: 'i' })
        .exp()
        .reshape({ shape: [-1, 1] })
        .view({ type: bb.Float32 })
        .insert({ with: 0, axes: [1], entries: [2] })

    constructor({ radius = 1, center }) {
        super(center)

        this.radius = radius

        this.points = Circle.template.add({
            with: Primitive.offset.invoke(this.center, null, Primitive.offset.result)
        })
    }
}
