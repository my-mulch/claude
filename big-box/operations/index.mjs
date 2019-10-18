import radley from '../../radley'

import * as linalg from './linalg'
import * as element from './element'
import * as probability from './probability'

export default radley.suite({
    ...linalg,
    ...element,
    ...probability,
    
    hash: ['args.of.id', 'args.with.id', 'args.result.id']
})
