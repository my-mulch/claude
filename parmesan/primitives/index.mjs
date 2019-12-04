import bb from '../../big-box/index.mjs'

export default class Primitive {
    static VERTEX_COUNT = 10

    static offset = new bb.cached.add({ of: bb.zeros({ shape: [Primitive.VERTEX_COUNT, 3] }), with: [[0, 0, 0]] })
    static scale = new bb.cached.multiply({ of: bb.zeros({ shape: [Primitive.VERTEX_COUNT, 3] }), with: 0 })

    constructor(center) {
        this.center = bb.tensor({ data: center || [[0, 0, 0]] })
    }

    render() {
        return [{
            vertices: this.points,
            colors: bb.ones({ shape: this.points.header.shape }),
            sizes: bb.ones({ shape: this.points.header.shape }),
            mode: 'POINTS'
        }]
    }
}

