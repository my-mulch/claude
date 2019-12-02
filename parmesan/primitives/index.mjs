import bb from '../../big-box'

export default class Primitive {
    constructor(center) {
        this.center = bb.tensor({ data: center || [[0, 0, 0, 1]] })
    }

    render() {
        return {
            vertices: this.points,
            colors: bb.ones({ shape: this.points.shape }),
            sizes: bb.ones({ shape: this.points.shape }),
            mode: 'POINTS'
        }
    }
}

Primitive.VERTEX_COUNT = 1000
Primitive.offset = new bb.cached.repeat({
    of: bb.zeros({ shape: [1, 3] }),
    axes: [0],
    count: Primitive.VERTEX_COUNT,
    template: true
})
