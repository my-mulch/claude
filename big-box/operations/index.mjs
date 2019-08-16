
const noop = function () { return '' }

export const exp = {
    begin: noop,
    middle: function ({ ofReal, ofImag, resultReal, resultImag }) {
        return [
            `var scale = Math.exp(${ofReal})`,

            `${resultReal} = scale * Math.cos(${ofImag})`,
            `${resultImag} = scale * Math.sin(${ofImag})`,
        ].join('\n')
    },
    end: noop
}

export const sin = {
    begin: noop,
    middle: function ({ ofReal, resultReal }) {
        return `${resultReal} = Math.sin(${ofReal})`
    },
    end: noop
}

export const cos = {
    begin: noop,
    middle: function ({ ofReal, resultReal }) {
        return `${resultReal} = Math.cos(${ofReal})`
    },
    end: noop
}

export const addition = {
    begin: noop,
    middle: function ({ ofReal, ofImag, withReal, withImag, resultReal, resultImag }) {
        return [
            `${resultReal} = ${ofReal} + ${withReal}`,
            `${resultImag} = ${ofImag} + ${withImag}`,
        ].join('\n')
    },
    end: noop
}

export const subtraction = {
    begin: noop,
    middle: function ({ ofReal, ofImag, withReal, withImag, resultReal, resultImag }) {
        return [
            `${resultReal} = ${ofReal} - ${withReal}`,
            `${resultImag} = ${ofImag} - ${withImag}`,
        ].join('\n')
    },
    end: noop
}

export const multiplication = {
    begin: noop,
    middle: function ({ ofReal, ofImag, withReal, withImag, resultReal, resultImag }) {
        return [
            `var ac = ${ofReal} * ${withReal}`,
            `var bd = ${ofImag} * ${withImag}`,
            `var apb = (${ofReal} + ${ofImag})`,
            `var cpd = (${withReal} + ${withImag})`,

            `${resultReal} = ac - bd`,
            `${resultImag} = apb * cpd - ac - bd`,
        ].join('\n')
    },
    end: noop
}

export const division = {
    begin: noop,
    middle: function ({ ofReal, ofImag, withReal, withImag, resultReal, resultImag }) {
        return [
            `var mod = ${withReal} === 0 && ${withImag} === 0 ? 1 : ${withReal} * ${withReal} + ${withImag} * ${withImag}`,

            `${resultReal} = (${ofReal} * ${withReal} + ${ofImag} * ${withImag}) / mod`,
            `${resultImag} = (${ofImag} * ${withReal} - ${ofReal} * ${withImag}) / mod`,
        ].join('\n')
    },
    end: noop
}

export const assignment = {
    begin: noop,
    middle: function ({ withReal, withImag, resultReal, resultImag }) {
        return [
            `${resultReal} = ${withReal}`,
            `${resultImag} = ${withImag}`,
        ].join('\n')
    },
    end: noop
}

export const min = {
    begin: function () { return `args.result.data.fill(Number.POSITIVE_INFINITY)` },
    middle: function ({ ofReal, ofImag, resultReal, resultImag }) {
        return [
            `if(${ofReal} < ${resultReal}) {`,
            `   ${resultReal} = ${ofReal}`,
            `   ${resultImag} = ${ofImag}`,
            `}`
        ].join('\n')
    },
    end: noop
}

export const max = {
    begin: function () { return `args.result.data.fill(Number.NEGATIVE_INFINITY)` },
    middle: function ({ ofReal, ofImag, resultReal, resultImag }) {
        return [
            `if(${ofReal} > ${resultReal}) {`,
            `   ${resultReal} = ${ofReal}`,
            `   ${resultImag} = ${ofImag}`,
            `}`
        ].join('\n')
    },
    end: noop
}

export const sum = {
    begin: function () {
        return [
            `args.result.data.fill(0)`,
            `args.result.data.fill(0)`,
        ]
    },
    middle: function ({ ofReal, ofImag, resultReal, resultImag }) {
        return [
            `${resultReal} += ${ofReal}`,
            `${resultImag} += ${ofImag}`,
        ].join('\n')
    },
    end: noop
}

export const norm = {
    begin: sum.begin,
    middle: function ({ ofReal, ofImag, resultReal }) {
        return `${resultReal} += ${ofReal} * ${ofReal} + ${ofImag} * ${ofImag}`
    },
    end: function () {
        return `
            for (let i = 0; i < args.result.data.length; i++) 
                args.result.data[i] = Math.sqrt(args.result.data[i])
        `
    }
}

export const mean = {
    begin: sum.begin,
    middle: sum.middle,
    end: function () {
        return `
            for (let i = 0; i < args.result.data.length; i++){
                args.result.data[i] /= args.meta.axesSize
                args.result.data[i + 1] /= args.meta.axesSize
            }
        `
    }
}

