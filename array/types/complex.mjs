import { stringNumber } from '../utils'

export default function (type) {
    return {
        size: 2,
        array: type,
        _o_: function (o) { return `args.of.data[${o}]` },
        _w_: function (w) { return `args.with.data[${w}]` },
        _r_: function (r) { return `args.result.data[${r}]` },
        spread: function ({ o, w, r }) {
            return {
                oR: o && this._o_(o),
                oI: o && this._o_(o + 1),

                wR: w && this._w_(w),
                wI: w && this._w_(w + 1),

                rR: r && this._r_(r),
                rI: r && this._r_(r + 1),
            }
        },
        add: function (indices) {
            const { oR, oI, wR, wI, rR, rI } = this.spread(indices)
            return [
                `${rR} = ${oR} + ${wR}`,
                `${rI} = ${oI} + ${wI}`,
            ].join('\n')
        },
        subtract: function (indices) {
            const { oR, oI, wR, wI, rR, rI } = this.spread(indices)
            return [
                `${rR} = ${oR} - ${wR}`,
                `${rI} = ${oI} - ${wI}`,
            ].join('\n')
        },
        multiply: function (indices) {
            const { oR, oI, wR, wI, rR, rI } = this.spread(indices)
            return [
                `${rR} = ${oR} * ${wR} - ${oI} * ${wI}`,
                `${rI} = ${oR} * ${wI} + ${oI} * ${wR}`,
            ].join('\n')
        },
        divide: function (indices) {
            const { oR, oI, wR, wI, rR, rI } = this.spread(indices)
            return [
                `var mod = ${wR} * ${wR} + ${wI} * ${wI}`,

                `${rR} = (${oR} * ${wR} + ${oI} * ${wI}) / mod`,
                `${rI} = (${oI} * ${wR} - ${oR} * ${wI}) / mod`,
            ].join('\n')
        },
        assign: function (indices) {
            const { wR, wI, rR, rI } = this.spread(indices)
            return [
                `${rR} = ${wR}`,
                `${rI} = ${wI}`,
            ].join('\n')
        },
        strOut: function ({ o, data }) {
            return stringNumber(data[o], data[o + 1])
        },
        strIn: function ({ o, data }) {
            return stringNumber(data[o], data[o + 1])
        }
    }
}
