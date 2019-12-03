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

        this.radius = bb.tensor({ data: radius })
        this.points = bb.zerosLike({ tensor: Circle.template })

        Primitive.scale.invoke(Circle.template, this.radius, this.points)
        Primitive.offset.invoke(this.points, this.center, this.points)
    }

    render() {
        return [{
            vertices: this.points,
            colors: this.points,
            sizes: this.points,
            mode: 'LINE_STRIP'
        }]
    }
}
