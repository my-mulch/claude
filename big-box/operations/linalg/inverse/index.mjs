import pointwise from './pointwise'

export default {
    inverse: {
        'args.result.size > 16': function () { },
        'args.result.size <= 16': pointwise
    }
}
