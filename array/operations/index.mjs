const noOp = function () { return '' }

const realOp = function ({ oR, wR }) {
    return oR !== undefined
        || wR !== undefined
}

const complexOp = function ({ oR, oI, wR, wI }) {
    return (oR !== undefined && oI !== undefined)
        || (wR !== undefined && wI !== undefined)
}

const quatOp = function ({ oR, oI, oJ, oK, wR, wI, wJ, wK }) {
    return (oR !== undefined && oI !== undefined && oJ !== undefined && oK !== undefined)
        || (wR !== undefined && wI !== undefined && wJ !== undefined && wK !== undefined)
}


export const exp = {
    preOp: noOp,
    op: function ({
        oR, oI, oJ, oK,
        wR, wI, wJ, wK,
        rR, rI, rJ, rK,
    }) {
        return [
            `var scale = Math.exp(${oR})`,

            `${rR} = scale * Math.cos(${oI})`,
            `${rI} = scale * Math.sin(${oI})`,
        ].join('\n')
    },
    postOp: noOp
}

export const sin = {
    preOp: noOp,
    op: function ({
        oR, oI, oJ, oK,
        wR, wI, wJ, wK,
        rR, rI, rJ, rK,
    }) {
        return `${rR} = Math.sin(${oR})`
    },
    postOp: noOp
}

export const cos = {
    preOp: noOp,
    op: function ({
        oR, oI, oJ, oK,
        wR, wI, wJ, wK,
        rR, rI, rJ, rK,
    }) {
        return `${rR} = Math.cos(${oR})`
    },
    postOp: noOp
}

export const addition = {
    preOp: noOp,
    op: function ({
        oR, oI, oJ, oK,
        wR, wI, wJ, wK,
        rR, rI, rJ, rK,
    }) {
        return [
            `${rR} = ${oR} + ${wR}`,
            `${rI} = ${oI} + ${wI}`,
        ].join('\n')
    },
    postOp: noOp
}

export const subtraction = {
    preOp: noOp,
    op: function ({
        oR, oI, oJ, oK,
        wR, wI, wJ, wK,
        rR, rI, rJ, rK,
    }) {
        return [
            `${rR} = ${oR} - ${wR}`,
            `${rI} = ${oI} - ${wI}`,
        ].join('\n')
    },
    postOp: noOp
}

export const multiplication = {
    preOp: noOp,
    op: function (args) {
        const {
            oR, oI, oJ, oK,
            wR, wI, wJ, wK,
            rR, rI, rJ, rK,
        } = args

        if (quatOp(args))
            return [
                `${rR} = ${oR} * ${wR} - ${oI} * ${wI} - ${oJ} * ${wJ} - ${oK} * ${wK}`,
                `${rI} = ${oR} * ${wI} + ${oI} * ${wR} + ${oJ} * ${wK} - ${oK} * ${wJ}`,
                `${rJ} = ${oR} * ${wJ} - ${oI} * ${wK} + ${oJ} * ${wR} + ${oK} * ${wI}`,
                `${rK} = ${oR} * ${wK} + ${oI} * ${wJ} - ${oJ} * ${wI} + ${oK} * ${wR}`,
            ].join('\n')

        if (complexOp(args))
            return [
                `${rR} = ${oR} * ${wR} - ${oI} * ${wI}`,
                `${rI} = ${oR} * ${wI} + ${oI} * ${wR}`,
            ].join('\n')

        if (realOp(args))
            return `${rR} = ${oR} * ${wR}`

    },
    postOp: noOp
}

export const division = {
    preOp: noOp,
    op: function ({
        oR, oI, oJ, oK,
        wR, wI, wJ, wK,
        rR, rI, rJ, rK,
    }) {
        return [
            `var mod = ${wR} === 0 && ${wI} === 0 ? 1 : ${wR} * ${wR} + ${wI} * ${wI}`,

            `${rR} = (${oR} * ${wR} + ${oI} * ${wI}) / mod`,
            `${rI} = (${oI} * ${wR} - ${oR} * ${wI}) / mod`,
        ].join('\n')
    },
    postOp: noOp
}

export const assignment = {
    preOp: noOp,
    op: function (args) {
        const {
            oR, oI, oJ, oK,
            wR, wI, wJ, wK,
            rR, rI, rJ, rK,
        } = args

        if (quatOp(args))
            return [
                `${rR} = ${wR}`,
                `${rI} = ${wI}`,
                `${rJ} = ${wJ}`,
                `${rK} = ${wK}`,
            ].join('\n')

        if (complexOp(args))
            return [
                `${rR} = ${wR}`,
                `${rI} = ${wI}`,
            ].join('\n')

        if (realOp(args))
            return `${rR} = ${wR}`

    },
    postOp: noOp
}

export const min = {
    preOp: function () {
        return `args.result.data.fill(Number.POSITIVE_INFINITY)`
    },
    op: function ({
        oR, oI, oJ, oK,
        wR, wI, wJ, wK,
        rR, rI, rJ, rK,
    }) {
        return [
            `if(${oR} < ${rR}) {`,
            `   ${rR} = ${oR}`,
            `   ${rI} = ${oI}`,
            `}`
        ].join('\n')
    },
    postOp: noOp
}

export const max = {
    preOp: function () {
        return `args.result.data.fill(Number.NEGATIVE_INFINITY)`
    },
    op: function ({
        oR, oI, oJ, oK,
        wR, wI, wJ, wK,
        rR, rI, rJ, rK,
    }) {
        return [
            `if(${oR} > ${rR}) {`,
            `   ${rR} = ${oR}`,
            `   ${rI} = ${oI}`,
            `}`
        ].join('\n')
    },
    postOp: noOp
}

export const sum = {
    preOp: function () {
        return [
            `args.result.data.fill(0)`,
            `args.result.data.fill(0)`,
        ]
    },
    op: function ({
        oR, oI, oJ, oK,
        wR, wI, wJ, wK,
        rR, rI, rJ, rK,
    }) {
        return [
            `${rR} += ${oR}`,
            `${rI} += ${oI}`,
        ].join('\n')
    },
    postOp: noOp
}

export const norm = {
    preOp: sum.preOp,
    op: function ({
        oR, oI, oJ, oK,
        wR, wI, wJ, wK,
        rR, rI, rJ, rK,
    }) {
        return `${rR} += ${oR} * ${oR} + ${oI} * ${oI}`
    },
    postOp: function () {
        return `
            for (let i = 0; i < args.result.data.length; i++) 
                args.result.data[i] = Math.sqrt(args.result.data[i])
        `
    }
}

export const mean = {
    preOp: sum.preOp,
    op: sum.op,
    postOp: function () {
        return `
            for (let i = 0; i < args.result.data.length; i++){
                args.result.data[i] /= args.meta.axesSize
                args.result.data[i + 1] /= args.meta.axesSize
            }
        `
    }
}


