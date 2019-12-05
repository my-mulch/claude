import bb from '../../big-box/index.mjs'

export default class Primitive {
    static VERTEX_COUNT = 150

    static offset = new bb.cached.add({ of: bb.zeros([Primitive.VERTEX_COUNT, 3]), with: [[[0], [0], [0]]] })
    static scale = new bb.cached.multiply({ of: bb.zeros([Primitive.VERTEX_COUNT, 3]), with: 0 })

    constructor(center) {
        this.center = bb.tensor(center || [[[0], [0], [0]]])
    }

    render() {
        return [{
            vertices: this.points,
            colors: bb.repeat({ of: bb.rand([1, 3]), axes: [0], count: this.points.header.shape[0] }),
            sizes: bb.ones(this.points.header.shape),
            mode: 'POINTS'
        }]
    }
}

