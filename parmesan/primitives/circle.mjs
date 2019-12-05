import bb from '../../big-box/index.mjs'
import Primitive from './index.mjs'

export default class Circle extends Primitive {
    static template = bb
        .linspace(0, 2 * Math.PI, Primitive.VERTEX_COUNT)
        .multiply({ with: [0, 1] })
        .exp()
        .reshape([-1, 1])
        .view(bb.Float32)
        .insert({ with: 0, axes: [1], entries: [2] })

    constructor({ radius = 1, center }) {
        super(center)

        this.radius = bb.tensor(radius)
        this.points = bb.zerosLike(Circle.template)

        Primitive.scale.invoke(Circle.template, this.radius, this.points)
        Primitive.offset.invoke(this.points, this.center, this.points)
    }

    render() {
        return [{
            vertices: this.points,
            colors: bb.onesLike(this.points),
            sizes: this.points,
            mode: 'LINE_STRIP'
        }]
    }
}
