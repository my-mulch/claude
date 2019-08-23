import { stringNumber, parseNumber } from '../utils'

class Complex {
    constructor(array) {
        this.size = 2
        this.array = array
    }

    _o_(oi) { return `args.of.data[${oi}]` }
    _w_(wi) { return `args.with.data[${wi}]` }
    _r_(ri) { return `args.result.data[${ri}]` }

    spread({ oi, wi, ri }) {
        return {
            oR: oi && this._o_(oi),
            oI: oi && this._o_(oi + 1),

            wR: wi && this._w_(wi),
            wI: wi && this._w_(wi + 1),

            rR: ri && this._r_(ri),
            rI: ri && this._r_(ri + 1),
        }
    }

    add(indices) {
        const { oR, oI, wR, wI, rR, rI } = this.spread(indices)
        return [
            `${rR} = ${oR} + ${wR}`,
            `${rI} = ${oI} + ${wI}`,
        ].join('\n')
    }

    subtract(indices) {
        const { oR, oI, wR, wI, rR, rI } = this.spread(indices)
        return [
            `${rR} = ${oR} - ${wR}`,
            `${rI} = ${oI} - ${wI}`,
        ].join('\n')
    }

    multiply(indices) {
        const { oR, oI, wR, wI, rR, rI } = this.spread(indices)
        return [
            `${rR} = ${oR} * ${wR} - ${oI} * ${wI}`,
            `${rI} = ${oR} * ${wI} + ${oI} * ${wR}`,
        ].join('\n')
    }

    divide(indices) {
        const { oR, oI, wR, wI, rR, rI } = this.spread(indices)
        return [
            `var mod = ${wR} * ${wR} + ${wI} * ${wI}`,

            `${rR} = (${oR} * ${wR} + ${oI} * ${wI}) / mod`,
            `${rI} = (${oI} * ${wR} - ${oR} * ${wI}) / mod`,
        ].join('\n')
    }

    assign(indices) {
        const { wR, wI, rR, rI } = this.spread(indices)
        return [
            `${rR} = ${wR}`,
            `${rI} = ${wI}`,
        ].join('\n')
    }

    strOut({ i, data }) {
        return stringNumber(data[i], data[i + 1])
    }

    strIn({ num, i, data }) {
        const number = parseNumber(num)

        data[i + 0] = number.r
        data[i + 1] = number.i
    }
}

export default {
    Uint8Clamped: new Complex(Uint8ClampedArray),
    Uint8: new Complex(Uint8Array),
    Uint16: new Complex(Uint16Array),
    Uint32: new Complex(Uint32Array),
    Int8: new Complex(Int8Array),
    Int16: new Complex(Int16Array),
    Int32: new Complex(Int32Array),
    Float32: new Complex(Float32Array),
}
