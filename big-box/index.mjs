import Type from './type'
import Cache from './cache'
import Tensor from './tensor'
import Operations from './operations'

/** Init data types */
Object.assign(Tensor, Type)

/** Init cache */
Tensor.cache = new Cache()

/** Init operations */
for (const [name, Operation] of Object.entries(Operations)) {

    /** Static operations */
    Tensor[name] = function (args = {}) {
        const [A, B] = Type.promote(
            Tensor.tensor({ data: args.of }),
            Tensor.tensor({ data: args.with })
        )

        const R = args.result || Tensor.zeros(Operation.resultant(A, B, null, args))

        let func = Tensor.cache.get(A, B, R, name)

        if (!func)
            func = Tensor.cache.set(A, B, R, name, new Operation(A, B, R, args))

        return func.invoke(A, B, R, args)
    }

    /** Instance operations */
    Tensor.prototype[name] = function (args = {}) {
        let operation = Operation.get(this, args.with, args.result, args)

        if (!operation)
            operation = Operation.set(this, args.with, args.result, args)

        return operation()
    }
}

export default Tensor
