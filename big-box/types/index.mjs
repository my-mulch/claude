export default class Type {
    constructor({ size, typed }) {
        this.size = size
        this.typed = typed
    }

    static promote(A, B) {
        return A.header.type.size > B.header.type.size ? A.header.type : B.header.type
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
