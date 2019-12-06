import WebGLManager from '../../managers/webgl.mjs'
import myio from '../../../myio/index.mjs'


export default async function () {
    const gl = new WebGLManager({
        canvas: document.getElementById('main'),
        vertexSource: await myio.txtread(`./parmesan/programs/first/shader.vert`),
        fragmentSource: await myio.txtread(`./parmesan/programs/first/shader.frag`),
    })

    /** Global */
    window.program = gl

    /** Variables */
    const aPosIndex = gl.attributes.a_Position.attributeLocation
    const aSizeIndex = gl.attributes.a_PointSize.attributeLocation

    /** GPU Data */
    gl.context.vertexAttrib3f(aPosIndex, 0., -0.1, .3);
    gl.context.vertexAttrib1f(aSizeIndex, 80);

    /** Clear color */
    gl.context.clearColor(0., 0.0, 0.0, 1.0)

    /** Clear <canvas> to set color */
    gl.context.clear(gl.context.COLOR_BUFFER_BIT)

    /** Draw */
    gl.context.drawArrays(gl.context.POINTS, 0, 2)
}
