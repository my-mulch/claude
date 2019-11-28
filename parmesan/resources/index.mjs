import bb from '../../big-box'

export default {
    CANVAS_STROKE_COLOR: 'white',
    CANVAS_FILL_COLOR: 'rgba(255, 165, 0, 1)',

    HUD_FONT: '18px serif',
    HUD_COLOR: 'rgba(255, 255, 255, 1)',
    HUD_TEXT_LOCATION: [10, 50],

    BINDINGS: {
        'o': { name: 'zoom', args: [true] },
        'i': { name: 'zoom', args: [false] },

        'ArrowUp': { name: 'pan', args: [0] },
        'ArrowDown': { name: 'pan', args: [1] },
        'ArrowLeft': { name: 'pan', args: [2] },
        'ArrowRight': { name: 'pan', args: [3] },
    },


    VERTEX_SOURCE:
        'attribute float a_PointSize;\n' +
        'attribute vec4 a_Position;\n' +
        'attribute vec4 a_Color;\n' +
        'uniform mat4 u_ViewMatrix;\n' +
        'uniform mat4 u_ProjMatrix;\n' +
        'varying vec4 v_Color;\n' +
        'void main() {\n' +
        '  gl_PointSize = a_PointSize;\n' +
        '  gl_Position = u_ProjMatrix * u_ViewMatrix * a_Position;\n' +
        '  v_Color = a_Color;\n' +
        '}\n',

    FRAGMENT_SOURCE:
        'precision mediump float;\n' +
        'varying vec4 v_Color;\n' +
        'void main() {\n' +
        '  gl_FragColor = v_Color;\n' +
        '}\n',


    UP: bb.tensor({ data: [[0], [1], [0], [1]] }),
    TO: bb.tensor({ data: [["0"], ["0"], ["0"], ["1"]] }),
    FROM: bb.tensor({ data: [["7"], ["3"], ["-5"], ["1"]] }),

    LOOK_MATRIX: bb.eye({ shape: [4, 4] }),
    VIEW_MATRIX: bb.eye({ shape: [4, 4] }),
    TRANSLATION_MATRIX: bb.eye({ shape: [4, 4] }),
    PROJECTION_MATRIX: bb.zeros({ shape: [4, 4] }),

    VIEWING_ANGLE: 30,
    ASPECT_RATIO: 1,
    NEAR: 1e-6,
    FAR: 1e6,

    ZOOM_DELTA: 0.02,
    PAN_DELTA: Math.PI / 128,

    DIRECTIONS: {
        UP: 0,
        DOWN: 1,
        LEFT: 2,
        RIGHT: 3,
    },
}
