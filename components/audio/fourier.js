import Component from '../index.js'
import Renderer from '../../tools/renderer.js'

export default class Fourier extends Component {
    static shaders = {
        fragment: [
            'precision mediump float;',
            'varying vec4 v_Color;',
            'void main() { gl_FragColor = v_Color; }'
        ].join('\n'),
        vertex: [
            'attribute float a_PointSize;',
            'attribute vec4 a_Position;',
            'attribute vec4 a_Color;',

            'uniform float N;',

            'varying vec4 v_Color;',

            'void main() {',
            '  gl_PointSize = a_PointSize;',
            '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;',
            '  v_Color = a_Color;',
            '}',
        ].join('\n')
    }

    constructor({ audio }) {
        super()

        this.audio = audio
        this.context = this.canvas.getContext('webgl')

        this.renderer = new Renderer({
            vertex: Fourier.shaders.vertex,
            fragment: Fourier.shaders.fragment,
            context: this.context,
        })

        const time = new Float32Array(this.audio.length)
        for (let i = 0; i < time.length; i++)
            time[i] = i

        const timeBuffer = this.renderer.buffer({ array: time })
        const audioBuffer = this.renderer.buffer({ array: this.audio })


        // this.renderer.a_Color({ buffer: this.renderer.buffer({ array: colors }), size: 3 })
        // this.renderer.a_PointSize({ buffer: this.renderer.buffer({ array: sizes }), size: 1 })
        // this.renderer.a_Position({ buffer: this.renderer.buffer({ array: positions }), size: 3 })


        // this.renderer.u_ProjMatrix(this.camera.proj)
        // this.renderer.u_ViewMatrix(this.camera.view)
        // this.renderer.u_ModelMatrix(this.trackball.model)

        // this.renderer.draw({ mode: this.renderer.context.POINTS, count: 75 * 75 })
    }
}