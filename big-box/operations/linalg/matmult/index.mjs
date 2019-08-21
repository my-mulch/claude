import symbolic from './symbolic'
import pointwise from './pointwise'

export default {
    matMult: {
        'args.result.size > 500': symbolic,
        'args.result.size <= 500': pointwise,
    }
}
