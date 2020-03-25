import Component from './index.js'

export default class ZoomView extends Component {
    constructor({ }) {
        /** Super */
        super()

        /** Display */
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.context = this.canvas.getContext('2d')
    }

    async render(region) {
        const imageData = this.context.createImageData(75, 75)

        for (let i = 0, j = 0; i < imageData.data.length; i += 4, j += 3) {
            imageData.data[i + 0] = region[j + 0] * 255
            imageData.data[i + 1] = region[j + 1] * 255
            imageData.data[i + 2] = region[j + 2] * 255
            imageData.data[i + 3] = 255
        }

        const bitmap = await createImageBitmap(imageData)
        this.context.drawImage(bitmap, 0, 0, this.canvas.width, this.canvas.height)
    }
}
