import * as axis from './axis'
import * as pair from './pair'
import * as linalg from './linalg'

const operations = { ...linalg, ...axis, ...pair }

export default {
    ...operations,
    wrap: function (invocation) {
        return Object.fromEntries(Object.entries(operations).map(invocation))
    }
}
