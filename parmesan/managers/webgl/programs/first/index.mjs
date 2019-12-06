import WebGLManager from '../../index.mjs'
import myio from '../../../../../myio/index.mjs'
import config from '../../../../resources/index.mjs'

// await myio.txtread(`${location}/parmesan/managers/webgl/programs/first/shader.frag`),
// await myio.txtread(`${location}/parmesan/managers/webgl/programs/first/shader.vert`),

var VSHADER_SOURCE =
    'void main() {\n' +
    '  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);\n' + // Set the vertex coordinates of the point
    '  gl_PointSize = 10.0;\n' +                    // Set the point size
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' + // Set the point color
    '}\n';

export default async function () {
    const gl = new WebGLManager({
        canvas: document.getElementById('main'),
        vertexSource: VSHADER_SOURCE,
        fragmentSource: FSHADER_SOURCE,
    })

    gl.context.clearColor(0.0, 0.0, 0.0, 1.0)

    // Clear <canvas>
    gl.context.clear(gl.context.COLOR_BUFFER_BIT)

    // Draw a point
    gl.context.drawArrays(gl.context.POINTS, 0, 1)
}
