import { stringNumber, parseNumber } from '../utils'

class Real {
    constructor(array) {
        this.size = 1
        this.array = array
    }

    _o_(oi) { return `args.of.data[${oi}]` }
    _w_(wi) { return `args.with.data[${wi}]` }
    _r_(ri) { return `args.result.data[${ri}]` }

    spread({ oi, wi, ri }) {
        return {
            oR: oi && this._o_(oi),
            wR: wi && this._w_(wi),
            rR: ri && this._r_(ri),
        }
    }

    add(indices) {
        const { oR, wR, rR } = this.spread(indices)
        return `${rR} = ${oR} + ${wR}`
    }

    subtract(indices) {
        const { oR, wR, rR } = this.spread(indices)
        return `${rR} = ${oR} - ${wR}`
    }

    divide(indices) {
        const { oR, wR, rR } = this.spread(indices)
        return `${rR} = ${oR} / ${wR}`
    }

    multiply(indices) {
        const { oR, wR, rR } = this.spread(indices)
        return `${rR} = ${oR} * ${wR}`
    }

    assign(indices) {
        const { wR, rR } = this.spread(indices)
        return `${rR} = ${wR}`
    }

    strOut({ i, data }) {
        return stringNumber(data[i])
    }

    strIn({ num, i, data }) {
        data[i] = parseNumber(num).r
    }
}

export default {
    Uint8Clamped: new Real(Uint8ClampedArray),
    Uint8: new Real(Uint8Array),
    Uint16: new Real(Uint16Array),
    Uint32: new Real(Uint32Array),
    Int8: new Real(Int8Array),
    Int16: new Real(Int16Array),
    Int32: new Real(Int32Array),
    Float32: new Real(Float32Array),
}