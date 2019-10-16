import radley from '../../radley'

import min from './elemental/min'

import cross from './linalg/cross'
import inverse from './linalg/inverse'
import matmult from './linalg/matmult'

import randrange from './probability/randrange'

export default radley.suite({
    min: { ...min },
    
    cross: { ...cross },
    inverse: { ...inverse },
    matmult: { ...matmult },
    cofactors: { ...cofactors },

    randrange: { ...randrange },

    hash: ['args.of.id', 'args.with.id', 'args.result.id']
})

