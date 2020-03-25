
export default class ConvView {
    constructor(attributes) {
        /** Display */
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')

        /** State */
        this.attributes = attributes

        /** Conv */
        this.convWidth = this.attributes.mask[0]
        this.convHeight = this.attributes.mask[1]
        this.relConvWidth = Math.floor(this.convWidth / 2)
        this.relConvHeight = Math.floor(this.convHeight / 2)

        /** Style */
        Object.assign(this.canvas.style, {
            width: '100%',
            height: '100%',
            cursor: `url('http://localhost:3000/Users/trumanpurnell/Pictures/conv25.png'), auto`
        })

        /** Draw */
        const bitmap = this.attributes.image.bitmap

        this.canvas.width = bitmap.width
        this.canvas.height = bitmap.height
        this.context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height)
    }

    convolve(x, y) {
        const region = []
        const pixels = this.attributes.image.pixels
        const bitmap = this.attributes.image.bitmap

        for (let rh = -this.relConvHeight; rh <= this.relConvHeight; rh++) {
            for (let cw = -this.relConvWidth; cw <= this.relConvWidth; cw++) {
                const cindex = x + cw
                const rindex = y + rh
                const pindex = rindex * bitmap.width * 3 + cindex * 3

                region.push(
                    pixels[pindex + 0],
                    pixels[pindex + 1],
                    pixels[pindex + 2]
                )
            }
        }

        return new Float32Array(region)
    }

    pointermove({ offsetX, offsetY }) {
        const bitmap = this.attributes.image.bitmap

        const x = Math.floor(bitmap.width * offsetX / this.canvas.offsetWidth)
        const y = Math.floor(bitmap.height * offsetY / this.canvas.offsetHeight)

        return this.convolve(x, y)
    }
}
