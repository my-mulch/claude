import Component from './index.js'

export default class ConvView extends Component {
    constructor({ mask, image }) {
        /** Super */
        super()

        /** State */
        this.mask = mask
        this.image = image
        this.region = new Float32Array(this.mask[0] * this.mask[1] * 3)

        /** Display */
        this.canvas = document.createElement('canvas')
        this.canvas.width = this.image.bitmap.width
        this.canvas.height = this.image.bitmap.height
        this.context = this.canvas.getContext('2d')
        this.context.drawImage(this.image.bitmap, 0, 0)
    }

    resize() {

    }

    convolve(x, y) {
        let i = 0

        for (let rh = 0; rh < this.mask[0]; rh++) {
            for (let cw = 0; cw < this.mask[1]; cw++) {
                const cindex = x + cw
                const rindex = y + rh
                const pindex = rindex * this.image.bitmap.width * 3 + cindex * 3

                this.region[i + 0] = this.image.pixels[pindex + 0]
                this.region[i + 1] = this.image.pixels[pindex + 1]
                this.region[i + 2] = this.image.pixels[pindex + 2]

                i += 3
            }
        }

        console.log(this.region)
        return this.region
    }

    pointerdown(event) {
        const bitmap = this.image.bitmap

        const x = Math.floor(bitmap.width * event.offsetX / this.canvas.offsetWidth)
        const y = Math.floor(bitmap.height * event.offsetY / this.canvas.offsetHeight)

        return this.convolve(x, y)
    }
}
