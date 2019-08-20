import { stringNumber } from '../utils'

export default function (type) {
    return {
        size: 4,
        array: type,
        _o_: function (o) { return `args.of.data[${o}]` },
        _w_: function (w) { return `args.with.data[${w}]` },
        _r_: function (r) { return `args.result.data[${r}]` },
        spread: function ({ o, w, r }) {
            return {
                oR: o && this._o_(o),
                oI: o && this._o_(o + 1),
                oJ: o && this._o_(o + 2),
                oK: o && this._o_(o + 3),

                wR: w && this._w_(w),
                wI: w && this._w_(w + 1),
                wJ: w && this._w_(w + 2),
                wK: w && this._w_(w + 3),

                rR: r && this._r_(r),
                rI: r && this._r_(r + 1),
                rJ: r && this._r_(r + 2),
                rK: r && this._r_(r + 3),
            }
        },
        add: function (indices) {
            const { oR, oI, oJ, oK, wR, wI, wJ, wK, rR, rI, rJ, rK } = this.spread(indices)
            return [
                `${rR} = ${oR} + ${wR}`,
                `${rI} = ${oI} + ${wI}`,
                `${rJ} = ${oJ} + ${wJ}`,
                `${rK} = ${oK} + ${wK}`,
            ].join('\n')
        },
        subtract: function (indices) {
            const { oR, oI, oJ, oK, wR, wI, wJ, wK, rR, rI, rJ, rK } = this.spread(indices)
            return [
                `${rR} = ${oR} - ${wR}`,
                `${rI} = ${oI} - ${wI}`,
                `${rJ} = ${oJ} - ${wJ}`,
                `${rK} = ${oK} - ${wK}`,
            ].join('\n')
        },
        multiply: function (indices) {
            const { oR, oI, oJ, oK, wR, wI, wJ, wK, rR, rI, rJ, rK } = this.spread(indices)
            return [
                `${rR} = ${oR} * ${wR} - ${oI} * ${wI} - ${oJ} * ${wJ} - ${oK} * ${wK}`,
                `${rI} = ${oR} * ${wI} + ${oI} * ${wR} + ${oJ} * ${wK} - ${oK} * ${wJ}`,
                `${rJ} = ${oR} * ${wJ} - ${oI} * ${wK} + ${oJ} * ${wR} + ${oK} * ${wI}`,
                `${rK} = ${oR} * ${wK} + ${oI} * ${wJ} - ${oJ} * ${wI} + ${oK} * ${wR}`,
            ].join('\n')
        },
        divide: function (indices) {
            const { oR, oI, oJ, oK, wR, wI, wJ, wK, rR, rI, rJ, rK } = this.spread(indices)
            return [
                `var mod = ${wR} * ${wR} + ${wI} * ${wI} + ${wJ} * ${wJ} + ${wK} * ${wK}`,

                `${rR} = (${wR} * ${oR} + ${wI} * ${oI} + ${wJ} * ${oJ} + ${wK} * ${oK}) / mod`,
                `${rI} = (${wR} * ${oI} - ${wI} * ${oR} - ${wJ} * ${oK} + ${wK} * ${oJ}) / mod`,
                `${rJ} = (${wR} * ${oJ} + ${wI} * ${oK} - ${wJ} * ${oR} - ${wK} * ${oI}) / mod`,
                `${rK} = (${wR} * ${oK} - ${wI} * ${oJ} + ${wJ} * ${oI} - ${wK} * ${oR}) / mod`,
            ].join('\n')
        },
        assign: function (indices) {
            const { wR, wI, wJ, wK, rR, rI, rJ, rK } = this.spread(indices)
            return [
                `${rR} = ${wR}`,
                `${rI} = ${wI}`,
                `${rJ} = ${wJ}`,
                `${rK} = ${wK}`,
            ].join('\n')
        },
        asString: function ({ o, data }) {
            return stringNumber(data[o], data[o + 1], data[o + 2], data[o + 3])
        }
    }
}
