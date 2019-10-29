
export default class Cache extends Object {
    get(A, B, R, method) {
        let value = this

        if (value = value[A.id])
            if (value = value[B.id])
                if (value = value[R.id])
                    if (value = value[method])
                        return value

        return {}
    }

    set(operation) {
        let value = this
        
        value[operation.A.id] = value[operation.A.id] || {}
        value[operation.B.id] = value[operation.B.id] || {}
        value[operation.R.id] = value[operation.R.id] || {}
        value[operation.name] = operation

        return operation
    }
}
