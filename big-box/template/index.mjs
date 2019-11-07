
export default class Template {
    static loop(init, check, delta) {
        return `for(${init}; ${check}; ${delta}){`
    }

    static loopAxes(axes, tensor) {
        return axes.map(function (axis) {
            return Template.loop(
                [`let i${axis} = 0`],
                [`i${axis} < ${tensor.shape[axis]}`],
                [`i${axis}++`])
        })
    }

    static prefix(axis) { return `i${axis}` }

    static index(variable, scalars, strides, offset) {
        return new Array(scalars.length).fill(null).reduce(function (index, _, i) {
            return `${index} + ${strides[i]} * ${scalars[i]}`
        }, `const ${variable} = ${offset}`)
    }
}