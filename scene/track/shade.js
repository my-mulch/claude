export default {
    fragment: [
        'precision mediump float;',
        'varying vec4 v_Color;',
        'void main() { gl_FragColor = v_Color; }'
    ],
    vertex: [
        'attribute float a_PointSize;',
        'attribute vec4 a_Position;',
        'attribute vec4 a_Color;',

        'uniform mat4 u_ViewMatrix;',
        'uniform mat4 u_ProjMatrix;',
        'uniform mat4 u_ModelMatrix;',

        'varying vec4 v_Color;',

        'void main() {',
        '  gl_PointSize = a_PointSize;',
        '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;',
        '  v_Color = a_Color;',
        '}',
    ]
}
