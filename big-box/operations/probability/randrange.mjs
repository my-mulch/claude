
export default {
    'true': function ({ low, high }) {
        return low + Math.random() * (high - low)
    }
}
