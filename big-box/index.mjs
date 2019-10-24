import Type from './type'
import Cache from './cache'
import Tensor from './tensor'
import Operations from './operations'

/** Init data types */
for (const [size, prefix] of [[1, ''], [2, 'Complex'], [4, 'Quat']]) {
    Tensor[prefix + 'Int8'] = new Type({ size, array: Int8Array })
    Tensor[prefix + 'Int16'] = new Type({ size, array: Int16Array })
    Tensor[prefix + 'Int32'] = new Type({ size, array: Int32Array })
    Tensor[prefix + 'Uint8'] = new Type({ size, array: Uint8Array })
    Tensor[prefix + 'Uint16'] = new Type({ size, array: Uint16Array })
    Tensor[prefix + 'Uint32'] = new Type({ size, array: Uint32Array })
    Tensor[prefix + 'Float32'] = new Type({ size, array: Float32Array })
    Tensor[prefix + 'Float64'] = new Type({ size, array: Float64Array })
    Tensor[prefix + 'Uint8Clamped'] = new Type({ size, array: Uint8ClampedArray })
}

/** Init cache */
Tensor.cache = new Cache()

/** Init null tensor */
Tensor.NULL = Tensor.zeros({ shape: [], type: Tensor.Int32 })

/** Init operations */
for (const [name, Operation] of Object.entries(Operations)) {

    /** Static operations */
    Tensor[name] = function (args = {}) {
        let A = args.of
        let B = args.with
        let R = args.result
        let meta = args.meta

        B = B || Tensor.NULL
        R = R || Tensor.zeros(Operation.resultant(A, B, R, meta))

        let func = Tensor.cache.get(A, B, R, name)

        if (!func)
            func = Tensor.cache.set(A, B, R, name, new Operation(A, B, R, meta))

        return func.invoke()
    }

    /** Instance operations */
    Tensor.prototype[name] = function (args = {}) {
        let A = this
        let B = args.with
        let R = args.result
        let meta = args.meta

        B = B || Tensor.NULL
        R = R || Tensor.zeros(Operation.resultant(A, B, R, meta))

        let func = Tensor.cache.get(A, B, R, name)

        if (!func)
            func = Tensor.cache.set(A, B, R, name, new Operation(A, B, R, meta))

        return func.invoke(A, B, R)
    }
}

export default Tensor
