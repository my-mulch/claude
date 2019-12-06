import WebGLManager from '../../managers/webgl/index.mjs'
import myio from '../../../myio/index.mjs'


export default async function () {
    const gl = new WebGLManager({
        canvas: document.getElementById('main'),
        vertexSource: await myio.txtread(`${location}/parmesan/programs/first/shader.vert`),
        fragmentSource: await myio.txtread(`${location}/parmesan/programs/first/shader.frag`),
    })

    gl.context.clearColor(0.0, 0.0, 0.0, 1.0)

    // Clear <canvas>
    gl.context.clear(gl.context.COLOR_BUFFER_BIT)

    // Draw a point
    gl.context.drawArrays(gl.context.POINTS, 0, 1)
}
