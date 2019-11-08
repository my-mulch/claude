import {
    __Math__, // misc resources
    TYPE, SHAPE, OFFSET, CONTIG, STRIDES, // init resources
    PARTIAL_SLICE, NUMBER, SLICE_CHARACTER, // slice resources
} from '../resources'

import Types from '../types'

export default class Header {
    constructor(opts) {
        this.type = opts.type !== undefined ? opts.type : Types.Float32
        this.shape = opts.shape !== undefined ? opts.shape : []
        this.offset = opts.offset !== undefined ? opts.offset : 0
        this.contig = opts.contig !== undefined ? opts.contig : true
        this.strides = opts.strides !== undefined ? opts.strides : Header.strides(this.shape, this.type)

        this.id = `${this.type.size}|${this.shape}|${this.strides}|${this.offset}`
        this.size = this.shape.reduce(__Math__.multiply, 1)
        this.lastStride = this.strides[this.strides.length - 1]
    }

    static isContigous(index) {
        let last = -1

        for (let i = 0; i < index.length; i++) {
            if (last >= 0
                && index[i].constructor === String
                && i - last > 1)
                return false

            if (index[i].constructor === String)
                last = i
        }

        return true
    }

    static nonZeroAxes(_, index) {
        const ri = this.shape.length - index - 1

        if (ri < 0) return false
        if (this.shape[ri] > 1) return true

        return false
    }

    static strides(shape, type, lastStride) {
        const strides = new Array(shape.length)

        let stride = lastStride || type.size
        strides[strides.length - 1] = stride

        for (let i = shape.length - 1; i > 0; i--)
            strides[i - 1] = (stride *= shape[i])

        return strides
    }

    static reshape(shape, size) {
        const reshape = new Array(shape.length)
        const product = shape.reduce(__Math__.multiply, 1)

        for (let i = 0; i < shape.length; i++)
            reshape[i] = shape[i] < 0 ? -size / product : shape[i]

        return reshape
    }

    copy() {
        return new Header(JSON.parse(JSON.stringify(this)))
    }

    flatIndex(index) {
        let flatIndex = this.offset

        for (let i = 0; i < index.length; i++)
            flatIndex += index[i] * this.strides[i]

        return flatIndex
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
                let [low, high] = index[i].split(SLICE_CHARACTER).map(Number)

                if (high === 0)
                    high = this.shape[i]

                offset += this.strides[i] * low

                shape.push(high - low)
                strides.push(this.strides[i])
            }

            /** 
             * If the index is a number, the user wants that index
             */

            else if (NUMBER.test(index[i]))
                offset += this.strides[i] * index[i]

        }

        return new Header({ shape, strides, offset, contig, type: this.type })
    }

    transpose() {
        return new Header({
            type: this.type,
            shape: this.shape.slice().reverse(),
            strides: this.strides.slice().reverse(),
            offset: this.offset,
            contig: false
        })
    }

    reshape(shape) {
        const newShape = Header.reshape(shape, this.size)
        const newStrides = Header.strides(newShape, this.type, this.lastStride)

        return new Header({
            type: this.type,
            shape: newShape,
            strides: newStrides,
        })
    }
}
