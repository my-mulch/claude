
export default {
    UP: [[[0]], [[1]], [[0]], [[1]]],
    TO: [[[0]], [[0]], [[0]], [[1]]],
    FROM: [[[10]], [[3]], [[12]], [[1]]],

    LOOK_MATRIX: [[[1], [0], [0], [0]], [[0], [1], [0], [0]], [[0], [0], [1], [0]], [[0], [0], [0], [1]]],
    VIEW_MATRIX: [[[1], [0], [0], [0]], [[0], [1], [0], [0]], [[0], [0], [1], [0]], [[0], [0], [0], [1]]],
    MOVE_MATRIX: [[[1], [0], [0], [0]], [[0], [1], [0], [0]], [[0], [0], [1], [0]], [[0], [0], [0], [1]]],
    PROJ_MATRIX: [[[0], [0], [0], [0]], [[0], [0], [0], [0]], [[0], [0], [0], [0]], [[0], [0], [0], [0]]],

    VIEWING_ANGLE: 30,
    ASPECT_RATIO: 1,
    NEAR: 1e-6,
    FAR: 1e6,

    ZOOM_DELTA: 0.01,
    PAN_DELTA: Math.PI / 128,

    SPACE: / +/g,
    NUMBER: /\d+/,
    PRECISION: 2,
    SLICE_CHARACTER: ':',
    PARTIAL_SLICE: /\d*:\d*:*\d*/,
    ARRAY_REPLACER: '],\n$1[',
    ARRAY_SPACER: /\]\,(\s*)\[/g,
    PARSE_NUMBER: /\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g,

    BINDINGS: {
        'o': { name: 'zoom', args: [true] },
        'i': { name: 'zoom', args: [false] },

        'ArrowUp': { name: 'pan', args: [0] },
        'ArrowDown': { name: 'pan', args: [1] },
        'ArrowLeft': { name: 'pan', args: [2] },
        'ArrowRight': { name: 'pan', args: [3] },
    },
    
    SYMBOL_FROM_ID: {
        0: '',
        1: 'i',
        2: 'j',
        3: 'k'
    },

    DIRECTIONS: {
        UP: 0,
        DOWN: 1,
        LEFT: 2,
        RIGHT: 3,
    },
}
