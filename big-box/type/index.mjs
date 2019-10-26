
export default class Type {
    constructor({ size, array }) {
        this.size = size
        this.array = array
    }

    static resolve(dimension) {
        if (dimension === 1) return Type.Float32
        if (dimension === 2) return Type.ComplexFloat32
        if (dimension > 2) return Type.QuatFloat32
    }

    static compare(t1, t2) {
        return t1.size >= t2.size
    }
}

Type.Int8 = new Type({ size: 1, array: Int8Array })
Type.Int16 = new Type({ size: 1, array: Int16Array })
Type.Int32 = new Type({ size: 1, array: Int32Array })
Type.Uint8 = new Type({ size: 1, array: Uint8Array })
Type.Uint16 = new Type({ size: 1, array: Uint16Array })
Type.Uint32 = new Type({ size: 1, array: Uint32Array })
Type.Float32 = new Type({ size: 1, array: Float32Array })
Type.Float64 = new Type({ size: 1, array: Float64Array })
Type.Uint8Clamped = new Type({ size: 1, array: Uint8ClampedArray })
Type.ComplexInt8 = new Type({ size: 2, array: Int8Array })
Type.ComplexInt16 = new Type({ size: 2, array: Int16Array })
Type.ComplexInt32 = new Type({ size: 2, array: Int32Array })
Type.ComplexUint8 = new Type({ size: 2, array: Uint8Array })
Type.ComplexUint16 = new Type({ size: 2, array: Uint16Array })
Type.ComplexUint32 = new Type({ size: 2, array: Uint32Array })
Type.ComplexFloat32 = new Type({ size: 2, array: Float32Array })
Type.ComplexFloat64 = new Type({ size: 2, array: Float64Array })
Type.ComplexUint8Clamped = new Type({ size: 2, array: Uint8ClampedArray })
Type.QuatInt8 = new Type({ size: 4, array: Int8Array })
Type.QuatInt16 = new Type({ size: 4, array: Int16Array })
Type.QuatInt32 = new Type({ size: 4, array: Int32Array })
Type.QuatUint8 = new Type({ size: 4, array: Uint8Array })
Type.QuatUint16 = new Type({ size: 4, array: Uint16Array })
Type.QuatUint32 = new Type({ size: 4, array: Uint32Array })
Type.QuatFloat32 = new Type({ size: 4, array: Float32Array })
Type.QuatFloat64 = new Type({ size: 4, array: Float64Array })
Type.QuatUint8Clamped = new Type({ size: 4, array: Uint8ClampedArray })