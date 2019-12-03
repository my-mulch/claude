import { PARSE_NUMBER, ID_FROM_SYMBOL, SPACE } from '../resources/index.mjs'

export default class Type {
    constructor({ size, typed }) {
        this.size = size
        this.typed = typed
    }

    static promote(A, B) {
        return A.type.size > B.type.size ? A.type : B.type
    }

    static isTypedArray(array) {
        if (array === undefined) return false

        return array.constructor === Int8Array
            || array.constructor === Int16Array
            || array.constructor === Int32Array
            || array.constructor === Uint8Array
            || array.constructor === Uint16Array
            || array.constructor === Uint32Array
            || array.constructor === Float32Array
            || array.constructor === Float64Array
            || array.constructor === Uint8ClampedArray
    }

    static resolve(data) {
        const number = Type.parse(data)

        if (number.length === 1) return Type.Float32
        if (number.length === 2) return Type.ComplexFloat32
        if (number.length > 2) return Type.QuatFloat32
    }


    static parse(number) {
        let token
        let sign = 1

        const result = []
        const tokens = String(number)
            .match(PARSE_NUMBER)
            .filter(function (token) { return !SPACE.test(token) })

        for (let i = 0; i < tokens.length; i++) {
            token = tokens[i]

            if (token in ID_FROM_SYMBOL) {
                if (isNaN(tokens[i - 1])) {
                    result[ID_FROM_SYMBOL[token]] = result[ID_FROM_SYMBOL[token]] || 0
                    result[ID_FROM_SYMBOL[token]] += sign
                }
            }

            else if (token === '+') sign = 1
            else if (token === '-') sign = -1

            else if (!isNaN(token)) {
                let symbol = tokens[i + 1]

                if (symbol in ID_FROM_SYMBOL) {
                    result[ID_FROM_SYMBOL[symbol]] = result[ID_FROM_SYMBOL[symbol]] || 0
                    result[ID_FROM_SYMBOL[symbol]] += sign * Number(token)
                } else {
                    result[0] = result[0] || 0
                    result[0] += sign * Number(token)
                }
            }
        }

        return result
    }

    array(data) {
        if (Type.isTypedArray(data))
            return data

        if (data.constructor === Array)
            return new this.typed(data.flatMap(function (number) {
                return this.align(Type.parse(number))
            }, this))

        if (data.constructor === Number)
            return new this.typed(data * this.size)
    }

    align(number) {
        number.length = this.size

        return Array.from(number, function (value) { return value || 0 })
    }
}

Type.Int8 = new (class Int8 extends Type { })({ size: 1, typed: Int8Array })
Type.Int16 = new (class Int16 extends Type { })({ size: 1, typed: Int16Array })
Type.Int32 = new (class Int32 extends Type { })({ size: 1, typed: Int32Array })
Type.Uint8 = new (class Uint8 extends Type { })({ size: 1, typed: Uint8Array })
Type.Uint16 = new (class Uint16 extends Type { })({ size: 1, typed: Uint16Array })
Type.Uint32 = new (class Uint32 extends Type { })({ size: 1, typed: Uint32Array })
Type.Float32 = new (class Float32 extends Type { })({ size: 1, typed: Float32Array })
Type.Float64 = new (class Float64 extends Type { })({ size: 1, typed: Float64Array })
Type.Uint8Clamped = new (class Uint8Clamped extends Type { })({ size: 1, typed: Uint8ClampedArray })

Type.ComplexInt8 = new (class ComplexInt8 extends Type { })({ size: 2, typed: Int8Array })
Type.ComplexInt16 = new (class ComplexInt16 extends Type { })({ size: 2, typed: Int16Array })
Type.ComplexInt32 = new (class ComplexInt32 extends Type { })({ size: 2, typed: Int32Array })
Type.ComplexUint8 = new (class ComplexUint8 extends Type { })({ size: 2, typed: Uint8Array })
Type.ComplexUint16 = new (class ComplexUint16 extends Type { })({ size: 2, typed: Uint16Array })
Type.ComplexUint32 = new (class ComplexUint32 extends Type { })({ size: 2, typed: Uint32Array })
Type.ComplexFloat32 = new (class ComplexFloat32 extends Type { })({ size: 2, typed: Float32Array })
Type.ComplexFloat64 = new (class ComplexFloat64 extends Type { })({ size: 2, typed: Float64Array })
Type.ComplexUint8Clamped = new (class ComplexUint8Clamped extends Type { })({ size: 2, typed: Uint8ClampedArray })

Type.QuatInt8 = new (class QuatInt8 extends Type { })({ size: 4, typed: Int8Array })
Type.QuatInt16 = new (class QuatInt16 extends Type { })({ size: 4, typed: Int16Array })
Type.QuatInt32 = new (class QuatInt32 extends Type { })({ size: 4, typed: Int32Array })
Type.QuatUint8 = new (class QuatUint8 extends Type { })({ size: 4, typed: Uint8Array })
Type.QuatUint16 = new (class QuatUint16 extends Type { })({ size: 4, typed: Uint16Array })
Type.QuatUint32 = new (class QuatUint32 extends Type { })({ size: 4, typed: Uint32Array })
Type.QuatFloat32 = new (class QuatFloat32 extends Type { })({ size: 4, typed: Float32Array })
Type.QuatFloat64 = new (class QuatFloat64 extends Type { })({ size: 4, typed: Float64Array })
Type.QuatUint8Clamped = new (class QuatUint8Clamped extends Type { })({ size: 4, typed: Uint8ClampedArray })