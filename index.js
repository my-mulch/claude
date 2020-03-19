import io from './io/index.js'
import TrackScene from './scene/type/track.js'
import Sketch from './scene/renderer.js/index.js'

export default async function main() {
    /** Inits -- function is scoped to window */
    const image = await io.imread('./assets/img/sun.jpg')

    const positions = image
    const colors = image.slice()
    const sizes = new Float32Array(image.length / 3).fill(1)

    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 0] -= 0.5
        positions[i + 1] -= 0.5
        positions[i + 2] -= 0.5
    }

    new TrackScene({
        sizes,
        colors,
        positions,
    })

}
