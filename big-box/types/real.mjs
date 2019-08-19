
export default function (type) {
    return {
        size: 1,
        array: type,
        add: function ({ oR, wR, rR }) {
            return `${rR} = ${oR} + ${wR}`
        },
        subtract: function ({ oR, wR, rR }) {
            return `${rR} = ${oR} - ${wR}`
        },
        divide: function ({ oR, wR, rR }) {
            return `${rR} = ${oR} / ${wR}`
        },
        multiply: function ({ oR, wR, rR }) {
            return `${rR} = ${oR} * ${wR}`
        },
        assign: function ({ wR, oR, rR }) {
            return `${rR} = ${wR}`
        },
        asString: function ({ oR }) {
            return oR
        }
    }
}
