import bb from '../../big-box/index.mjs'
import Primitive from './index.mjs'

export default class Cube extends Primitive {
    constructor({ center }) {
        super(center)

        this.points = bb.tensor([
            [[0], [0], [0]],
            [[0], [0], [1]],
            [[0], [0], [0]],
            [[0], [1], [0]],
            [[0], [0], [0]],
            [[1], [0], [0]],
            [[1], [1], [1]],
            [[1], [0], [1]],
            [[1], [1], [1]],
            [[0], [1], [1]],
            [[1], [1], [1]],
            [[1], [1], [0]],
            [[0], [0], [1]],
            [[0], [1], [1]],
            [[0], [1], [1]],
            [[0], [1], [0]],
            [[0], [1], [0]],
            [[1], [1], [0]],
            [[1], [1], [0]],
            [[1], [0], [0]],
            [[1], [0], [0]],
            [[1], [0], [1]],
            [[1], [0], [1]],
            [[0], [0], [1]],
        ])
    }

    render() {
        return [{
            vertices: this.points,
            colors: bb.ones(this.points.header.shape),
            sizes: bb.ones(this.points.header.shape),
            mode: 'LINES'
        }]
    }
}
