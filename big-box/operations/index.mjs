import Cache from '../cache'

import * as pair from './pair'
import * as linalg from './linalg'
import * as element from './element'

export default new Cache({ ...linalg, ...element, ...pair })
