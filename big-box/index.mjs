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
for (const method in Operations.methods) {
    // Static
    Tensor[method] = function (args) {
        const A = args.of
        const B = args.with || Tensor.NULL
        const R = args.result
        const meta = args.meta

        return Operations.invoke(A, B, R, meta, method)
    }

    // Instance
    Tensor.prototype[method] = function (args) {
        const A = this
        const B = args.with || Tensor.NULL
        const R = args.result
        const meta = args.meta

        return Operations.invoke(A, B, R, meta, method)
    }
}

export default Tensor