import { stringNumber, parseNumber } from '../utils'

export default function (type) {
    return {
        size: 1,
        array: type,
        _o_: function (o) { return `args.of.data[${o}]` },
        _w_: function (w) { return `args.with.data[${w}]` },
        _r_: function (r) { return `args.result.data[${r}]` },
        spread: function ({ o, w, r }) {
            return {
                oR: o && this._o_(o),
                wR: w && this._w_(w),
                rR: r && this._r_(r),
            }
        },
        add: function (indices) {
            const { oR, wR, rR } = this.spread(indices)
            return `${rR} = ${oR} + ${wR}`
        },
        subtract: function (indices) {
            const { oR, wR, rR } = this.spread(indices)
            return `${rR} = ${oR} - ${wR}`
        },
        divide: function (indices) {
            const { oR, wR, rR } = this.spread(indices)
            return `${rR} = ${oR} / ${wR}`
        },
        multiply: function (indices) {
            const { oR, wR, rR } = this.spread(indices)
            return `${rR} = ${oR} * ${wR}`
        },
        assign: function (indices) {
            const { wR, rR } = this.spread(indices)
            return `${rR} = ${wR}`
        },
        strIn: function ({ o, data }) {
            return stringNumber(data[o])
        },
        strOut: function ({ num, o, data }) {
            data[0] = parseNumber(num).r
        }
    }
}
