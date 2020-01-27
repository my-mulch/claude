
export default class Tensor {
    constructor(data, header) {
        this.data = data
        this.header = header
    }

    /** Numpy API */
    static API = 'http://localhost:5000'

    /** Numpy Types */
    static int8 = class int8 extends Int8Array { }
    static int16 = class int16 extends Int16Array { }
    static int32 = class int32 extends Int32Array { }
    static int64 = class int64 extends BigInt64Array { }
    static uint8 = class uint8 extends Uint8Array { }
    static uint16 = class uint16 extends Uint16Array { }
    static uint32 = class uint32 extends Uint32Array { }
    static uint64 = class uint64 extends BigUint64Array { }
    static float32 = class float32 extends Float32Array { }
    static float64 = class float64 extends Float64Array { }
    static complex32 = class complex32 extends Float32Array { }
    static complex64 = class complex64 extends Float64Array { }

    static replacer(_, value) {
        return value.constructor === Function ? value.name : value
    }

    static async request(method, args) {
        return await fetch(`${Tensor.API}/${method}`, {
            method: 'GET',
            headers: { args }
        })
    }

    static async unpack(response) {
        const header = JSON.parse(response.headers.get('metadata'))
        const data = new Tensor[header.dtype](await response.arrayBuffer())

        return [data, header]
    }

    static async ones(
        shape,
        dtype = null,
        order = 'C'
    ) {
        const response = await Tensor.request(
            Tensor.ones.name,
            JSON.stringify({ shape, dtype, order }, Tensor.replacer))

        const [data, header] = await Tensor.unpack(response)

        return new Tensor(data, header)
    }

    static async array(
        object,
        dtype = null,
        copy = true,
        order = 'K',
        subok = false,
        ndmin = 0
    ) {
        const response = await Tensor.request(
            Tensor.array.name,
            JSON.stringify({ object, dtype, copy, order, subok, ndmin }, Tensor.replacer))

        const [data, header] = await Tensor.unpack(response)

        return new Tensor(data, header)
    }

    async reshape(...shape) {
        const response = await Tensor.request(
            this.reshape.name,
            JSON.stringify({ header: this.header, shape }, Tensor.replacer))

        return new Tensor(this.data, JSON.parse(response.headers.get('metadata')))
    }

    static async dot(
        a,
        b,
    ) {
        const response = await Tensor.request(
            Tensor.dot.name,
            JSON.stringify({ a: a.header, b: b.header }, Tensor.replacer))

        const [data, header] = await Tensor.unpack(response)

        return new Tensor(data, header)
    }

    async toString() {
        const response = await Tensor.request(
            this.toString.name,
            JSON.stringify(this.header, Tensor.replacer))

        return await response.text()
    }
}

Tensor.random = class Random {
    static async randn(...dims) {
        const response = await Tensor.request(
            Random.randn.name,
            JSON.stringify({ dims }, Tensor.replacer))

        const [data, header] = await Tensor.unpack(response)

        return new Tensor(data, header)
    }
}
