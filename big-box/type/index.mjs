
class Type {
    constructor({ size, array }) {
        this.size = size
        this.array = array
    }
}

export default {
    Int8: new Type({ size: 1, array: Int8Array }),
    Int16: new Type({ size: 1, array: Int16Array }),
    Int32: new Type({ size: 1, array: Int32Array }),
    Uint8: new Type({ size: 1, array: Uint8Array }),
    Uint16: new Type({ size: 1, array: Uint16Array }),
    Uint32: new Type({ size: 1, array: Uint32Array }),
    Float32: new Type({ size: 1, array: Float32Array }),
    Float64: new Type({ size: 1, array: Float64Array }),
    Uint8Clamped: new Type({ size: 1, array: Uint8ClampedArray }),

    ComplexInt8: new Type({ size: 2, array: Int8Array }),
    ComplexInt16: new Type({ size: 2, array: Int16Array }),
    ComplexInt32: new Type({ size: 2, array: Int32Array }),
    ComplexUint8: new Type({ size: 2, array: Uint8Array }),
    ComplexUint16: new Type({ size: 2, array: Uint16Array }),
    ComplexUint32: new Type({ size: 2, array: Uint32Array }),
    ComplexFloat32: new Type({ size: 2, array: Float32Array }),
    ComplexFloat64: new Type({ size: 2, array: Float64Array }),
    ComplexUint8Clamped: new Type({ size: 2, array: Uint8ClampedArray }),

    QuatInt8: new Type({ size: 4, array: Int8Array }),
    QuatInt16: new Type({ size: 4, array: Int16Array }),
    QuatInt32: new Type({ size: 4, array: Int32Array }),
    QuatUint8: new Type({ size: 4, array: Uint8Array }),
    QuatUint16: new Type({ size: 4, array: Uint16Array }),
    QuatUint32: new Type({ size: 4, array: Uint32Array }),
    QuatFloat32: new Type({ size: 4, array: Float32Array }),
    QuatFloat64: new Type({ size: 4, array: Float64Array }),
    QuatUint8Clamped: new Type({ size: 4, array: Uint8ClampedArray }),
}
