import Algebra from '../algebra'
import ElementOperation from './operation'

export default class Repeat extends ElementOperation {
    constructor(A, B, R, { axes = [] }) {
        super(A, B, R, axes, function () {
            return {}
        })
    }

    static resultant(A, B, R, { num = 0, axes = [] }) {
        if (!axes.length)
            return { type: A.type, shape: [A.size * num] }

        return {
            type: A.type,
            shape: A.shape.map(function (value, dim) {
                return dim === axes[0] ? num * value : value
            })
        }
    }

}
