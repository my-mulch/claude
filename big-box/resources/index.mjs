
export const TYPE = 'type'
export const SHAPE = 'shape'
export const OFFSET = 'offset'
export const CONTIG = 'contig'
export const STRIDES = 'strides'

export const SPACE_REGEX = / +/g
export const NUMBER_REGEX = /\d+/
export const NUMERIC_SYMBOLS = ['', 'i', 'j', 'k']
export const SLICE_CHARACTER_REGEX = ':'
export const PARTIAL_SLICE_REGEX = /\d*:\d*/
export const ARRAY_REPLACER_REGEX = '],\n$1['
export const ARRAY_SPACER_REGEX = /\]\,(\s*)\[/g
export const PARSE_NUMBER_REGEX = /(\+|-)*\s*\d+(\.\d*)?/g

export const __Math__ = Object.assign(Math, {
    add: function (a, b) { return a + b },
    subtract: function (a, b) { return a - b },
    divide: function (a, b) { return a / b },
    multiply: function (a, b) { return a * b },
})

