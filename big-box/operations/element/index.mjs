import symbolic from './templates/symbolic'
import flattened from './templates/flattened'
import pointwise from './templates/pointwise'

import {
    // axis ops
    min, max, mean, norm, sum,
    // pair ops
    exp, sin, cos, addition, subtraction,
    multiplication, division, assignment,
} from '../../operations'

export default {
    utils: {},
    operations: {
        exp: {
            'args.meta.axesSize <= 20': pointwise(exp),
            'args.meta.axesSize <= 100': flattened(exp),
            'args.meta.axesSize > 100': symbolic(exp)
        },
        sin: {
            'args.meta.axesSize <= 20': pointwise(sin),
            'args.meta.axesSize <= 100': flattened(sin),
            'args.meta.axesSize > 100': symbolic(sin)
        },
        cos: {
            'args.meta.axesSize <= 20': pointwise(cos),
            'args.meta.axesSize <= 100': flattened(cos),
            'args.meta.axesSize > 100': symbolic(cos)
        },
        add: {
            'args.meta.axesSize <= 20': pointwise(addition),
            'args.meta.axesSize <= 100': flattened(addition),
            'args.meta.axesSize > 100': symbolic(addition)
        },
        subtract: {
            'args.meta.axesSize <= 20': pointwise(subtraction),
            'args.meta.axesSize <= 100': flattened(subtraction),
            'args.meta.axesSize > 100': symbolic(subtraction)
        },
        multiply: {
            'args.meta.axesSize <= 20': pointwise(multiplication),
            'args.meta.axesSize <= 100': flattened(multiplication),
            'args.meta.axesSize > 100': symbolic(multiplication)
        },
        divide: {
            'args.meta.axesSize <= 20': pointwise(division),
            'args.meta.axesSize <= 100': flattened(division),
            'args.meta.axesSize > 100': symbolic(division)
        },
        assign: {
            'args.meta.axesSize <= 20': pointwise(assignment),
            'args.meta.axesSize <= 100': flattened(assignment),
            'args.meta.axesSize > 100': symbolic(assignment)
        },
        min: {
            'args.meta.axesSize <= 20': pointwise(min),
            'args.meta.axesSize <= 100': flattened(min),
            'args.meta.axesSize > 100': symbolic(min),
        },
        max: {
            'args.meta.axesSize <= 20': pointwise(max),
            'args.meta.axesSize <= 100': flattened(max),
            'args.meta.axesSize > 100': symbolic(max),
        },
        mean: {
            'args.meta.axesSize <= 20': pointwise(mean),
            'args.meta.axesSize <= 100': flattened(mean),
            'args.meta.axesSize > 100': symbolic(mean),
        },
        norm: {
            'args.meta.axesSize <= 20': pointwise(norm),
            'args.meta.axesSize <= 100': flattened(norm),
            'args.meta.axesSize > 100': symbolic(norm),
        },
        sum: {
            'args.meta.axesSize <= 20': pointwise(sum),
            'args.meta.axesSize <= 100': flattened(sum),
            'args.meta.axesSize > 100': symbolic(sum),
        }
    }

}
