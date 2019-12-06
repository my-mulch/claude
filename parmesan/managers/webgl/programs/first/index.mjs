import WebGLManager from '../../index.mjs'
import myio from '../../../../../myio/index.mjs'

// await myio.txtread(`${location}/parmesan/managers/webgl/programs/first/shader.frag`),
// await myio.txtread(`${location}/parmesan/managers/webgl/programs/first/shader.vert`),

export default async function () {
    const gl = new WebGLManager({
        canvas: document.getElementById('main'),
        vertexSource:
            'void main() {\n' +
            '}\n',
        fragmentSource:
            'precision mediump float;\n' +
            'void main() {\n' +
            '  gl_FragColor = vec4(1.0,1.0,1.0,1.0);\n' +
            '}\n'
    })
}
