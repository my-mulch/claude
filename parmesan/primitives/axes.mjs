import bb from '../../big-box.mjs'
import Primitive from '..mjs'

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
        return {
            vertices: this.points,
            colors: bb.ones({ shape: this.points.shape }),
            sizes: bb.ones({ shape: this.points.shape }),
            mode: 'LINES'
        }
    }
}


