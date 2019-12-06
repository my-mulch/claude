import WebGLManager from '../../index.mjs'
import myio from '../../../../../myio/index.mjs'
import config from '../../../../resources/index.mjs'

// await myio.txtread(`${location}/parmesan/managers/webgl/programs/first/shader.frag`),
// await myio.txtread(`${location}/parmesan/managers/webgl/programs/first/shader.vert`),

export default async function () {
    const gl = new WebGLManager({
        canvas: document.getElementById('main'),
        vertexSource: config.VERTEX_SOURCE,
        fragmentSource: config.FRAGMENT_SOURCE,
    })
}
