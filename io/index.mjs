
export default class IO {
    static async txtread(path) {
        const response = await fetch(path)

        return response.text()
    }

    static async audioread(path) {
        const context = new AudioContext()

        const response = await fetch(path)
        const arrayBuffer = await response.arrayBuffer()
        const audioBuffer = await context.decodeAudioData(arrayBuffer)

        return audioBuffer.getChannelData(0)
    }

    static async imread(path) {
        // Build canvas init context
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        // fetch
        const response = await fetch(path)
        const imageBlob = await response.blob()
        const bitmap = await createImageBitmap(imageBlob)

        // paint
        const region = [0, 0, bitmap.width, bitmap.height]
        canvas.width = bitmap.width
        canvas.height = bitmap.height
        context.drawImage(bitmap, ...region)

        // clean up
        canvas.remove()

        let dataWithAlpha = context.getImageData(...region).data
        const dataWithoutAlpha = new Float32Array(bitmap.width * bitmap.height * 3)

        for (let i = 0, j = 0; i < dataWithAlpha.length; i += 4, j += 3) {
            dataWithoutAlpha[j] = dataWithAlpha[i] / 255
            dataWithoutAlpha[j + 1] = dataWithAlpha[i + 1] / 255
            dataWithoutAlpha[j + 2] = dataWithAlpha[i + 2] / 255
        }

        dataWithAlpha = null

        return dataWithoutAlpha
    }
}
