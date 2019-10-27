
export default class Cache extends Object {
    get(A, B, R, method) {
        if (!B) B = { id: '' }
        
        let value = this

        if (value = value[A.id])
            if (value = value[B.id])
                if (value = value[R.id])
                    if (value = value[method])
                        return value

        return null
    }

    set(A, B, R, method, value) {
        if (!B) B = { id: '' }

        this[A.id] = this[A.id] || {}
        this[A.id][B.id] = this[A.id][B.id] || {}
        this[A.id][B.id][R.id] = this[A.id][B.id][R.id] || {}
        this[A.id][B.id][R.id][method] = value

        return value
    }
}
