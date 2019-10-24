import Type from './type'
import Cache from './cache'
import Tensor from './tensor'
import Operations from './operations'

/** Init cache */
Tensor.cache = new Cache()

/** Init null tensor */
Tensor.NULL = Tensor.zeros({ shape: [], type: Tensor.Int32 })

/** Init data types */
for (const [dimension, prefix] of [[1, ''], [2, 'Complex'], [4, 'Quat']]) {
    Tensor[prefix + 'Int8'] = new Type({ dimension, array: Int8Array })
    Tensor[prefix + 'Int16'] = new Type({ dimension, array: Int16Array })
    Tensor[prefix + 'Int32'] = new Type({ dimension, array: Int32Array })
    Tensor[prefix + 'Uint8'] = new Type({ dimension, array: Uint8Array })
    Tensor[prefix + 'Uint16'] = new Type({ dimension, array: Uint16Array })
    Tensor[prefix + 'Uint32'] = new Type({ dimension, array: Uint32Array })
    Tensor[prefix + 'Float32'] = new Type({ dimension, array: Float32Array })
    Tensor[prefix + 'Float64'] = new Type({ dimension, array: Float64Array })
    Tensor[prefix + 'Uint8Clamped'] = new Type({ dimension, array: Uint8ClampedArray })
}

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

        return func.invoke()
    }
}

export default Tensor
