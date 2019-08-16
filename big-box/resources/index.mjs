export const SLICE_CHARACTER = ':'

export const ARRAY_SPACER = /\]\,(\s*)\[/g
export const ARRAY_REPLACER = '],\n$1['

export const TYPE = 'type'
export const SHAPE = 'shape'
export const OFFSET = 'offset'
export const CONTIG = 'contig'
export const STRIDES = 'strides'

export const QUAT = 'Quat'
export const COMPLEX = 'Complex'

export const NUMBER_REGEX = /\d+/
export const PARTIAL_SLICE_REGEX = /\d*:\d*/
export const QUATERNION_REGEX = /\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g

export const __Math__ = Object.assign(Math, {
    add: function (a, b) { return a + b },
    subtract: function (a, b) { return a - b },
    divide: function (a, b) { return a / b },
    multiply: function (a, b) { return a * b },
})
