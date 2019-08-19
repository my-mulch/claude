
export default function (type) {
    return {
        size: 2,
        array: type,
        add: function ({ oR, oI, wR, wI, rR, rI }) {
            return [
                `${rR} = ${oR} + ${wR}`,
                `${rI} = ${oI} + ${wI}`,
            ].join('\n')
        },
        subtract: function ({ oR, oI, wR, wI, rR, rI }) {
            return [
                `${rR} = ${oR} - ${wR}`,
                `${rI} = ${oI} - ${wI}`,
            ].join('\n')
        },
        multiply: function ({ oR, oI, wR, wI, rR, rI }) {
            return [
                `${rR} = ${oR} * ${wR} - ${oI} * ${wI}`,
                `${rI} = ${oR} * ${wI} + ${oI} * ${wR}`,
            ].join('\n')
        },
        divide: function ({ oR, oI, wR, wI, rR, rI }) {
            return [
                `var mod = ${wR} * ${wR} + ${wI} * ${wI}`,

                `${rR} = (${oR} * ${wR} + ${oI} * ${wI}) / mod`,
                `${rI} = (${oI} * ${wR} - ${oR} * ${wI}) / mod`,
            ].join('\n')
        },
        assign: function ({ wR, wI, rR, rI }) {
            return [
                `${rR} = ${wR}`,
                `${rI} = ${wI}`,
            ].join('\n')
        },
        asString: function ({ oR, oI }) {

        }
    }
}
