
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

        return {
            shape: [bitmap.width, bitmap.height, 4],
            pixels: context.getImageData(...region).data,
            binary: bitmap
        }
    }
}
