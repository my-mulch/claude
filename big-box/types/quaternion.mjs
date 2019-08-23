import { stringNumber, parseNumber } from '../utils'

class Quaternion {
    constructor(array) {
        this.size = 4
        this.array = array
    }

    _o_(oi) { return `args.of.data[${oi}]` }
    _w_(wi) { return `args.with.data[${wi}]` }
    _r_(ri) { return `args.result.data[${ri}]` }

    spread({ oi, wi, ri }) {
        return {
            oR: oi && this._o_(oi),
            oI: oi && this._o_(oi + 1),
            oJ: oi && this._o_(oi + 2),
            oK: oi && this._o_(oi + 3),

            wR: wi && this._w_(wi),
            wI: wi && this._w_(wi + 1),
            wJ: wi && this._w_(wi + 2),
            wK: wi && this._w_(wi + 3),

            rR: ri && this._r_(ri),
            rI: ri && this._r_(ri + 1),
            rJ: ri && this._r_(ri + 2),
            rK: ri && this._r_(ri + 3),
        }
    }

    add(indices) {
        const { oR, oI, oJ, oK, wR, wI, wJ, wK, rR, rI, rJ, rK } = this.spread(indices)
        return [
            `${rR} = ${oR} + ${wR}`,
            `${rI} = ${oI} + ${wI}`,
            `${rJ} = ${oJ} + ${wJ}`,
            `${rK} = ${oK} + ${wK}`,
        ].join('\n')
    }

    subtract(indices) {
        const { oR, oI, oJ, oK, wR, wI, wJ, wK, rR, rI, rJ, rK } = this.spread(indices)
        return [
            `${rR} = ${oR} - ${wR}`,
            `${rI} = ${oI} - ${wI}`,
            `${rJ} = ${oJ} - ${wJ}`,
            `${rK} = ${oK} - ${wK}`,
        ].join('\n')
    }

    multiply(indices) {
        const { oR, oI, oJ, oK, wR, wI, wJ, wK, rR, rI, rJ, rK } = this.spread(indices)
        return [
            `${rR} = ${oR} * ${wR} - ${oI} * ${wI} - ${oJ} * ${wJ} - ${oK} * ${wK}`,
            `${rI} = ${oR} * ${wI} + ${oI} * ${wR} + ${oJ} * ${wK} - ${oK} * ${wJ}`,
            `${rJ} = ${oR} * ${wJ} - ${oI} * ${wK} + ${oJ} * ${wR} + ${oK} * ${wI}`,
            `${rK} = ${oR} * ${wK} + ${oI} * ${wJ} - ${oJ} * ${wI} + ${oK} * ${wR}`,
        ].join('\n')
    }

    divide(indices) {
        const { oR, oI, oJ, oK, wR, wI, wJ, wK, rR, rI, rJ, rK } = this.spread(indices)
        return [
            `var mod = ${wR} * ${wR} + ${wI} * ${wI} + ${wJ} * ${wJ} + ${wK} * ${wK}`,

            `${rR} = (${wR} * ${oR} + ${wI} * ${oI} + ${wJ} * ${oJ} + ${wK} * ${oK}) / mod`,
            `${rI} = (${wR} * ${oI} - ${wI} * ${oR} - ${wJ} * ${oK} + ${wK} * ${oJ}) / mod`,
            `${rJ} = (${wR} * ${oJ} + ${wI} * ${oK} - ${wJ} * ${oR} - ${wK} * ${oI}) / mod`,
            `${rK} = (${wR} * ${oK} - ${wI} * ${oJ} + ${wJ} * ${oI} - ${wK} * ${oR}) / mod`,
        ].join('\n')
    }

    assign(indices) {
        const { wR, wI, wJ, wK, rR, rI, rJ, rK } = this.spread(indices)
        return [
            `${rR} = ${wR}`,
            `${rI} = ${wI}`,
            `${rJ} = ${wJ}`,
            `${rK} = ${wK}`,
        ].join('\n')
    }

    strOut({ i, data }) {
        return stringNumber(
            data[i + 0],
            data[i + 1],
            data[i + 2],
            data[i + 3])
    }

    strIn({ num, i, data }) {
        const number = parseNumber(num)

        data[i + 0] = number.r
        data[i + 1] = number.i
        data[i + 2] = number.j
        data[i + 3] = number.k
    }

}

export default {
    Uint8Clamped: new Quaternion(Uint8ClampedArray),
    Uint8: new Quaternion(Uint8Array),
    Uint16: new Quaternion(Uint16Array),
    Uint32: new Quaternion(Uint32Array),
    Int8: new Quaternion(Int8Array),
    Int16: new Quaternion(Int16Array),
    Int32: new Quaternion(Int32Array),
    Float32: new Quaternion(Float32Array),
}
