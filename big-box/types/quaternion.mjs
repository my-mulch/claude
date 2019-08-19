
export default function (type) {
    return {
        size: 4,
        array: type,
        add: function ({ oR, oI, oJ, oK, wR, wI, wJ, wK, rR, rI, rJ, rK }) {
            return [
                `${rR} = ${oR} + ${wR}`,
                `${rI} = ${oI} + ${wI}`,
                `${rJ} = ${oJ} + ${wJ}`,
                `${rK} = ${oK} + ${wK}`,
            ].join('\n')
        },
        subtract: function ({ oR, oI, oJ, oK, wR, wI, wJ, wK, rR, rI, rJ, rK }) {
            return [
                `${rR} = ${oR} - ${wR}`,
                `${rI} = ${oI} - ${wI}`,
                `${rJ} = ${oJ} - ${wJ}`,
                `${rK} = ${oK} - ${wK}`,
            ].join('\n')
        },
        multiply: function ({ oR, oI, oJ, oK, wR, wI, wJ, wK, rR, rI, rJ, rK }) {
            return [
                `${rR} = ${oR} * ${wR} - ${oI} * ${wI} - ${oJ} * ${wJ} - ${oK} * ${wK}`,
                `${rI} = ${oR} * ${wI} + ${oI} * ${wR} + ${oJ} * ${wK} - ${oK} * ${wJ}`,
                `${rJ} = ${oR} * ${wJ} - ${oI} * ${wK} + ${oJ} * ${wR} + ${oK} * ${wI}`,
                `${rK} = ${oR} * ${wK} + ${oI} * ${wJ} - ${oJ} * ${wI} + ${oK} * ${wR}`,
            ].join('\n')
        },
        divide: function ({ oR, oI, oJ, oK, wR, wI, wJ, wK, rR, rI, rJ, rK }) {
            return [
                `var mod = ${wR} * ${wR} + ${wI} * ${wI} + ${wJ} * ${wJ} + ${wK} * ${wK}`,

                `${rR} = (${wR} * ${oR} + ${wI} * ${oI} + ${wJ} * ${oJ} + ${wK} * ${oK}) / mod`,
                `${rI} = (${wR} * ${oI} - ${wI} * ${oR} - ${wJ} * ${oK} + ${wK} * ${oJ}) / mod`,
                `${rJ} = (${wR} * ${oJ} + ${wI} * ${oK} - ${wJ} * ${oR} - ${wK} * ${oI}) / mod`,
                `${rK} = (${wR} * ${oK} - ${wI} * ${oJ} + ${wJ} * ${oI} - ${wK} * ${oR}) / mod`,
            ].join('\n')
        },
        assign: function ({ wR, wI, wJ, wK, rR, rI, rJ, rK }) {
            return [
                `${rR} = ${wR}`,
                `${rI} = ${wI}`,
                `${rJ} = ${wJ}`,
                `${rK} = ${wK}`,
            ].join('\n')
        },
        asString: function ({ oR, oI, oJ, oK }) {

        }
    }
}
