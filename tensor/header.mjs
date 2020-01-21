
export default class Header {
    constructor(type, shape, strides, offset, contig) {
        this.type = type
        this.shape = shape
        this.count = this.shape.reduce(function (a, b) { return a * b }, 1)

        this.offset = offset !== undefined ? offset : 0
        this.contig = contig !== undefined ? contig : true
        this.strides = strides !== undefined ? strides : this.resolveStrides(this.shape)
    }

    static config = {
        NUMBER: /\d+/,
        SLICE_CHARACTER: ':',
        PARTIAL_SLICE: /\d*:\d*:*\d*/,
    }

    static isContigous(index) {
        let last = index.length

        for (let i = index.length - 1; i >= 0; i--) {
            if (index[i].constructor === String &&
                index[i].includes(Header.config.SLICE_CHARACTER)) {

                if (i + 1 !== last)
                    return false

                last = i

            } else if (last === index.length)
                return false
        }

        return true
    }

    resolveStrides(shape) {
        let stride = this.type.size
        const strides = new Array(shape.length)
        strides[strides.length - 1] = stride

        for (let i = shape.length - 1; i > 0; i--)
            strides[i - 1] = (stride *= shape[i])

        return strides
    }

    resolveShape(shape) {
        const newShape = new Array(shape.length)
        const product = shape.reduce(function (a, b) { return a * b }, 1)

        for (let i = 0; i < shape.length; i++)
            newShape[i] = shape[i] < 0 ? -this.count / product : shape[i]

        return newShape
    }

    copy() {
        return new Header(
            this.type,
            this.shape.slice(),
            this.strides.slice(),
            this.offset,
            this.contig)
    }

    view(type) {
        const ratio = this.type.size / type.size
        const header = this.copy()

        header.type = type
        header.size *= ratio
        header.shape[header.shape.length - 1] *= ratio
        header.strides[header.strides.length - 1] /= ratio

        return header
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

            if (index[i] === Header.config.SLICE_CHARACTER || index[i] === undefined)
                shape.push(this.shape[i]), strides.push(this.strides[i])

            /** 
             * If the index is a slice of the form 'a:b', the user wants a slice from a to b 
            */

            else if (Header.config.PARTIAL_SLICE.test(index[i])) {
                let [low, high, step] = index[i].split(Header.config.SLICE_CHARACTER).map(Number)

                if (high === 0) high = this.shape[i]

                if (!step) step = 1

                offset += this.strides[i] * low

                shape.push(Math.ceil((high - low) / step))
                strides.push(this.strides[i] * step)
            }

            /** 
             * If the index is a number, the user wants that index
             */

            else if (Header.config.NUMBER.test(index[i]))
                offset += this.strides[i] * index[i]

        }

        return new Header(this.type, shape, strides, offset, contig)
    }

    transpose() {
        return new Header(
            this.type,
            this.shape.slice().reverse(),
            this.strides.slice().reverse(),
            this.offset,
            false)
    }

    reshape(shape) {
        const newShape = this.resolveShape(shape)
        const newStrides = this.resolveStrides(newShape)

        return new Header(
            this.type,
            newShape,
            newStrides,
            this.offset,
            false)
    }
}
