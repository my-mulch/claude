import WebGLManager from '../../managers/webgl/index.mjs'
import myio from '../../../myio/index.mjs'


export default async function () {
    const gl = new WebGLManager({
        canvas: document.getElementById('main'),
        vertexSource: await myio.txtread(`./parmesan/programs/first/shader.vert`),
        fragmentSource: await myio.txtread(`./parmesan/programs/first/shader.frag`),
    })

    /** Global */
    window.program = gl

    /** Variable */
    const location = gl.attributes.a_Position.attributeLocation

    /** GPU Data */
    gl.context.vertexAttrib3f(location, 1., -0.1, .3);

    /** Clear color */
    gl.context.clearColor(0., 0.0, 0.0, 1.0)

    /** Clear <canvas> to set color */
    gl.context.clear(gl.context.COLOR_BUFFER_BIT)

    /** Draw */
    gl.context.drawArrays(gl.context.POINTS, 0, 1)
}
