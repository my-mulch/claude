import Cache from '../cache'

import * as linalg from './linalg'
import * as element from './element'
import * as probability from './probability'

export default new Cache({
    ...linalg,
    ...element,
    ...probability,
})
