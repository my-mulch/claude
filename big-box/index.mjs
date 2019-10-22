import Tensor from './tensor'
import Operations from './operations'

/** Init data types */
for (const [size, prefix] of [[1, ''], [2, 'Complex'], [4, 'Quat']]) {
    Tensor[prefix + 'Uint8Clamped'] = { size, array: Uint8ClampedArray }
    Tensor[prefix + 'Uint8'] = { size, array: Uint8Array }
    Tensor[prefix + 'Uint16'] = { size, array: Uint16Array }
    Tensor[prefix + 'Uint32'] = { size, array: Uint32Array }
    Tensor[prefix + 'Int8'] = { size, array: Int8Array }
    Tensor[prefix + 'Int16'] = { size, array: Int16Array }
    Tensor[prefix + 'Int32'] = { size, array: Int32Array }
    Tensor[prefix + 'Float32'] = { size, array: Float32Array }
}

/** Init null tensor */
Tensor.NULL = Tensor.zeros({ shape: [], type: Tensor.Int32 })

/** Init operations */
for (const [name, operation] of Object.entries(Operations.methods)) {

    /** Static operations */
    Tensor[name] = function (args = {}) {
        let A = args.of
        let B = args.with
        let R = args.result
        let axes = args.axes

        B = B || Tensor.NULL
        R = R || Tensor.zeros(operation.resultant(A, B, R, axes))

        return Operations.invoke(A, B, R, axes, name)
    }

    /** Instance operations */
    Tensor.prototype[name] = function (args = {}) {
        let A = this
        let B = args.with
        let R = args.result
        let axes = args.axes

        B = B || Tensor.NULL
        R = R || Tensor.zeros(operation.resultant(A, B, R, axes))

        return Operations.invoke(A, B, R, axes, name)
    }
}

export default Tensor
