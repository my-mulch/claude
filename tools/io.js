
export default class io {
    static async txtread(path) {
        const response = await fetch(path)

        return response.text()
    }

    static async wavread(path) {
        const context = new AudioContext()

        const response = await fetch(path)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await context.decodeAudioData(arrayBuffer)

        return audioBuffer.getChannelData(0)
    }

    static async imread(path) {
        // fetch
        let response = await fetch(path)
        let imageBlob = await response.blob()
        const bitmap = await createImageBitmap(imageBlob)

        // Build canvas init context
        let canvas = document.createElement('canvas')
        let context = canvas.getContext('2d')

        // paint
        let region = [0, 0, bitmap.width, bitmap.height]
        canvas.width = bitmap.width
        canvas.height = bitmap.height
        context.drawImage(bitmap, ...region)

        // buffer
        let dataWithAlpha = context.getImageData(...region).data
        const pixels = new Float32Array(bitmap.width * bitmap.height * 3)

        for (let i = 0, j = 0; i < dataWithAlpha.length; i += 4, j += 3) {
            pixels[j + 0] = dataWithAlpha[i + 0] / 255
            pixels[j + 1] = dataWithAlpha[i + 1] / 255
            pixels[j + 2] = dataWithAlpha[i + 2] / 255
        }

        // clean up
        canvas.remove()
        region = null
        canvas = null
        context = null
        response = null
        imageBlob = null
        dataWithAlpha = null

        return { bitmap, pixels }
    }
}
