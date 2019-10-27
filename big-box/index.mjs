import Types from './type'
import Cache from './cache'
import Tensor from './tensor'
import Operations from './operations'

/** Init data types */
Object.assign(Tensor, Types)

/** Init cache */
Tensor.cache = new Cache()

/** Init null tensor */
Tensor.NULL = Tensor.zeros({ shape: [], type: Tensor.Float32 })

/** Init operations */
for (const [name, Operation] of Object.entries(Operations)) {

    /** Static operations */
    Tensor[name] = function (args = {}) {
        let A = Tensor.tensor({ data: args.of })
        let B = Tensor.tensor({ data: args.with })
        let R = args.result
        let axes = args.axes

        B = B || Tensor.NULL
        R = R || Tensor.zeros(Operation.resultant(A, B, R, axes))

        let func = Tensor.cache.get(A, B, R, name)

        if (!func)
            func = Tensor.cache.set(A, B, R, name, new Operation(A, B, R, axes))

        return func.invoke()
    }

    /** Instance operations */
    Tensor.prototype[name] = function (args = {}) {
        let A = this
        let B = Tensor.tensor({ data: args.with })
        let R = args.result
        let axes = args.axes

        B = B || Tensor.NULL
        R = R || Tensor.zeros(Operation.resultant(A, B, R, axes))

        let func = Tensor.cache.get(A, B, R, name)

        if (!func)
            func = Tensor.cache.set(A, B, R, name, new Operation(A, B, R, axes))

        return func.invoke(A, B, R)
    }
}

export default Tensor
