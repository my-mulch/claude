import Types from '../types/index.mjs'
import { __Math__, PARTIAL_SLICE, NUMBER, SLICE_CHARACTER } from '../resources/index.mjs'

export default class Header {
    constructor(opts) {
        this.type = opts.type !== undefined ? opts.type : Types.Float32
        this.shape = opts.shape !== undefined ? opts.shape : []
        this.offset = opts.offset !== undefined ? opts.offset : 0
        this.contig = opts.contig !== undefined ? opts.contig : true
        this.strides = opts.strides !== undefined ? opts.strides : this.resolveStrides(this.shape)
        this.size = this.shape.reduce(__Math__.multiply, 1)
    }

    static isContigous(index) {
        let last = index.length

        for (let i = index.length - 1; i >= 0; i--) {
            if (index[i].constructor === String &&
                index[i].includes(SLICE_CHARACTER)) {

                if (i + 1 !== last)
                    return false

                last = i

            } else if (last === index.length)
                return false
        }

        return true
    }

    resolveStrides(shape, stride = this.type.size) {
        const strides = new Array(shape.length)
        strides[strides.length - 1] = stride

        for (let i = shape.length - 1; i > 0; i--)
            strides[i - 1] = (stride *= shape[i])

        return strides
    }

    resolveShape(shape) {
        const newShape = new Array(shape.length)
        const product = shape.reduce(__Math__.multiply, 1)

        for (let i = 0; i < shape.length; i++)
            newShape[i] = shape[i] < 0 ? -this.size / product : shape[i]

        return newShape
    }

    copy() {
        return new Header(JSON.parse(JSON.stringify(this)))
    }

    literalIndex(axes) {
        let literalIndex = this.offset

        for (let i = 0; i < axes.length; i++)
            literalIndex += axes[i] * this.strides[i]

        return literalIndex
    }

    symbolicIndex(axes) {
        let symbolicIndex = [`${this.offset}`]

        for (const [axis, strides] of Object.values(axes))
            symbolicIndex.push(`(${axis} * ${strides})`)

        return symbolicIndex.join('+')
    }

    nonZeroAxes(axes) {
        const nonZeroAxes = {}

        let i = this.shape.length - 1
        let j = axes.length - 1

        for (; i >= 0 && j >= 0; i-- , j--)
            if (this.shape[i] > 1)
                nonZeroAxes[axes[j]] = [`i${axes[j]}`, this.strides[i]]

        return nonZeroAxes
    }

    slice(index) {
        const shape = new Array()
        const strides = new Array()
        const contig = Header.isContigous(index)

        let offset = this.offset

        for (let i = 0; i < this.shape.length; i++) {

            /**
             *  If the index is a ':', the user wants that entire dimension 
             */

            if (index[i] === SLICE_CHARACTER || index[i] === undefined)
                shape.push(this.shape[i]), strides.push(this.strides[i])

            /** 
             * If the index is a slice of the form 'a:b', the user wants a slice from a to b 
            */

            else if (PARTIAL_SLICE.test(index[i])) {
                let [low, high, step] = index[i].split(SLICE_CHARACTER).map(Number)

                if (high === 0)
                    high = this.shape[i]

                if (!step)
                    step = 1

                offset += this.strides[i] * low

                shape.push(__Math__.ceil((high - low) / step))
                strides.push(this.strides[i] * step)
            }

            /** 
             * If the index is a number, the user wants that index
             */

            else if (NUMBER.test(index[i]))
                offset += this.strides[i] * index[i]

        }

        return new Header({ ...this, shape, strides, offset, contig })
    }

    transpose() {
        return new Header({
            ...this,
            contig: false,
            shape: this.shape.slice().reverse(),
            strides: this.strides.slice().reverse(),
        })
    }

    reshape(shape) {
        const newShape = this.resolveShape(shape)
        const newStrides = this.resolveStrides(newShape)

        return new Header({
            ...this,
            shape: newShape,
            strides: newStrides,
        })
    }
}
