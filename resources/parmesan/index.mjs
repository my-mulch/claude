import bb from 'big-box'

export const CONTEXT_WEB_GL = 'webgl'

export const HUD_FONT = '18px serif'
export const HUD_COLOR = 'rgba(255, 255, 255, 1)'
export const HUD_TEXT_LOCATION = [10, 50]

export const CANVAS_STROKE_COLOR = 'white'
export const CANVAS_FILL_COLOR = 'rgba(255, 165, 0, 1)'

export const BINDINGS = {
    'o': { name: 'zoom', args: [true] },
    'i': { name: 'zoom', args: [false] },

    'ArrowUp': { name: 'pan', args: [0] },
    'ArrowDown': { name: 'pan', args: [1] },
    'ArrowLeft': { name: 'pan', args: [2] },
    'ArrowRight': { name: 'pan', args: [3] },
}


export const VERTEX_SOURCE =
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
    '}\n'

export const FRAGMENT_SOURCE =
    'precision mediump float;\n' +
    'varying vec4 v_Color;\n' +
    'void main() {\n' +
    '  gl_FragColor = v_Color;\n' +
    '}\n'


export const TO_VECTOR = bb.array({ with: [[0], [0], [0], [1]] })
export const UP_VECTOR = bb.array({ with: [[0], [1], [0], [1]] })
export const FROM_VECTOR = bb.array({ with: [[0], [0], [20], [1]] })

export const VIEWING_ANGLE = 30
export const ASPECT_RATIO = 1
export const NEAR = 0.1
export const FAR = 100

export const ZOOM_DELTA = 0.05
export const PAN_DELTA = Math.PI / 64
export const ACTIVE_VERTICES = 0

export const UP_DIRECTION = 0
export const DOWN_DIRECTION = 1
export const LEFT_DIRECTION = 2
export const RIGHT_DIRECTION = 3


