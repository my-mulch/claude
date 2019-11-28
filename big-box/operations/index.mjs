import * as axis from './axis'
import * as pair from './pair'
import * as linalg from './linalg'
import * as create from './create'

const operations = { ...linalg, ...axis, ...pair, ...create }

export default {
    ...operations,
    wrap: function (invocation) {
        return Object.fromEntries(Object.entries(operations).map(invocation))
    }
}
