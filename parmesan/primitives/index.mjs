import bb from '../../big-box/index.mjs'

export default class Primitive {
    static VERTEX_COUNT = 50
    
    static offset = new bb.cached.repeat({
        of: bb.zeros({ shape: [1, 3] }),
        axes: [0],
        count: Primitive.VERTEX_COUNT,
        template: true
    })

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

