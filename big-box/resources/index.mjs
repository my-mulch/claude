
export const TYPE = 'type'
export const SHAPE = 'shape'
export const OFFSET = 'offset'
export const CONTIG = 'contig'
export const STRIDES = 'strides'
export const SPACE = / +/g
export const NUMBER = /\d+/
export const SLICE_CHARACTER = ':'
export const PARTIAL_SLICE = /\d*:\d*/
export const ARRAY_REPLACER = '],\n$1['
export const ARRAY_SPACER = /\]\,(\s*)\[/g
export const PARSE_NUMBER = /\d+\.?\d*e[+-]?\d+|\d+\.?\d*|\.\d+|./g

export const SYMBOL_FROM_NUMBER = { 0: '', 1: 'i', 2: 'j', 3: 'k', }
export const NUMBER_FROM_SYMBOL = { '': 0, 'i': 1, 'I': 1, 'j': 2, 'J': 2, 'k': 3, 'K': 3 }

export const __Math__ = Object.assign(Math, {
    add: function (a, b) { return a + b },
    subtract: function (a, b) { return a - b },
    divide: function (a, b) { return a / b },
    multiply: function (a, b) { return a * b },
})

