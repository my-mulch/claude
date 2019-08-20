
export default class MyIO {
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
        const dataWithoutAlpha = new Uint8ClampedArray(bitmap.width * bitmap.height * 3)

        for (let i = 0, j = 0; i < dataWithAlpha.length; i += 4, j += 3) {
            dataWithoutAlpha[j] = dataWithAlpha[i]
            dataWithoutAlpha[j + 1] = dataWithAlpha[i + 1]
            dataWithoutAlpha[j + 2] = dataWithAlpha[i + 2]
        }

        dataWithAlpha = null

        return {
            shape: [bitmap.width, bitmap.height, 3],
            pixels: dataWithoutAlpha,
            binary: bitmap
        }
    }
}
