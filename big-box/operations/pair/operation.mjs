import Operation from '../operations'

import { initialize } from '../../operations/utils'
import { select, result, symbolic } from '../pair/utils'

export default class PairOperation extends Operation {
    constructor(operation) {
        super({
            initialize,
            select,
            result,
            symbolic
        })

        this.operation = operation.bind(this)
    }

    create(A, B, R, axes) {
        Object.assign(this, this.initialize(A, B, R, axes))

        const tier = this.select(A, B, R, axes)

        return tier(this.operation())
    }

    result(A, B, R, axes) {
        return this.__result__(A, B, R, axes)
    }
}