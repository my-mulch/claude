import radley from '../../radley'

import * as linalgOperations from './linalg'
import * as elementalOperations from './elemental'
import * as probabilityOperations from './probability'

const suite = radley.suite({
    ...linalgOperations,
    ...elementalOperations,
    ...probabilityOperations,
    
    hash: ['args.of.id', 'args.with.id', 'args.result.id']
})

export default suite