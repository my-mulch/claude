import bb from '../../big-box/index.mjs'
import Primitive from './index.mjs'

export default class Axes extends Primitive {
    constructor({ length = 10 }) {
        super()

        this.length = length

        this.points = bb.tensor({
            data: [
                [0, 0, -this.length],
                [0, 0, this.length],
                [0, -this.length, 0],
                [0, this.length, 0],
                [-this.length, 0, 0],
                [this.length, 0, 0],
            ]
        })
    }

    render() {
        return [{
            vertices: this.points,
            colors: bb.ones({ shape: this.points.shape }),
            sizes: bb.ones({ shape: this.points.shape }),
            mode: 'LINES'
        }]
    }
}


