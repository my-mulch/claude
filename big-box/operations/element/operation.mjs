import Operation from '../operation'

import { initialize } from '../../operations/utils'
import { select, result, symbolic } from '../element/utils'

export default class ElementOperation extends Operation {
    constructor(operation) {
        super({ initialize, select, result, symbolic })
        this.operation = operation.bind(this)
    }

    select(A, B, R, axes) {
        Object.assign(this, this.initialize(A, B, R, axes))

        return this.symbolic(this.operation())
    }
}