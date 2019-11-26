
export default class Source {
    constructor(code = []) { this.chain = code.join('\n') }

    static loop(init, check, delta) {
        return `for(${init}; ${check}; ${delta}){`
    }

    static loopAxes(axes, tensor) {
        return axes.map(function (axis) {
            return Source.loop(
                [`let i${axis} = 0`],
                [`i${axis} < ${tensor.shape[axis]}`],
                [`i${axis}++`])
        })
    }

    static prefix(axis) { return `i${axis}` }

    static index(variable, scalars, strides, offset) {
        return new Array(strides.length).fill(null).reduce(function (index, _, i) {
            return `${index} + ${strides[i]} * ${scalars[i]}`
        }, `const ${variable} = ${offset}`)
    }

    static dot(a, b) {
        return a.map(function (_, i) { return `${a[i]} * ${b[i]}` }).join('+')
    }

    plus(value) {
        this.chain += value ? `+ ${value}` : ''

        return this
    }

    const(name) {
        this.chain += `const ${name}`

        return this
    }

    equals(value) {
        this.chain += ` = ${value}`

        return this
    }

    then(statements) {
        this.chain += ['{', ...statements, '}'].join('\n')

        return this
    }

    if(condition) {
        this.chain += `if(${condition})`

        return this
    }

    else(statements) {
        this.chain += ['else {', ...statements, '}'].join('\n')

        return this
    }

    elseIf(condition) {
        this.chain += `else if(${condition})`

        return this
    }

    toString() { return this.chain }
}
