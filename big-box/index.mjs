import Type from './type'
import Cache from './cache'
import Tensor from './tensor'
import Operations from './operations'

/** Init data types */
Object.assign(Tensor, Type)

/** Init cache */
Tensor.cache = new Cache()

/** Init null tensor */
Tensor.NULL = Tensor.zeros({ shape: [], type: Tensor.Float32 })

/** Init operations */
for (const [name, Operation] of Object.entries(Operations)) {

    /** Static operations */
    Tensor[name] = function (args = {}) {
        const [A, B] = Type.promote(
            Tensor.tensor({ data: args.of }),
            Tensor.tensor({ data: args.with }) || Tensor.NULL
        )

        const axes = args.axes
        const R = args.result || Tensor.zeros(Operation.resultant(A, B, null, axes))

        let func = Tensor.cache.get(A, B, R, name)

        if (!func)
            func = Tensor.cache.set(A, B, R, name, new Operation(A, B, R, axes))

        return func.invoke()
    }

    /** Instance operations */
    Tensor.prototype[name] = function (args = {}) {
        const [A, B] = Type.promote(
            this,
            Tensor.tensor({ data: args.with }) || Tensor.NULL,
        )

        const axes = args.axes
        const R = args.result || Tensor.zeros(Operation.resultant(A, B, null, axes))

        let func = Tensor.cache.get(A, B, R, name)

        if (!func)
            func = Tensor.cache.set(A, B, R, name, new Operation(A, B, R, axes))

        return func.invoke(A, B, R)
    }
}

export default Tensor
