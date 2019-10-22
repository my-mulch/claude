import Algebra from '../../algebra'
import Operation from '../operation'

import { init } from '../../operations/utils'
import { test, result, symbolic } from '../pair/utils'

export default new Operation({ test, init, result, symbolic, operation: Algebra.multiply })
