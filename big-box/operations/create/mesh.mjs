import Tensor from '../../tensor'
import Source from '../../template/source'
import { __Math__ } from '../../resources'

export default class Mesh {
    constructor(args) {
        this.dimensions = args.of
        this.result = args.result || this.resultant()
        this.invoke = new Function(this.symbolicSourceTemplate())
    }

    loop(dimension, i) {
        return Source.loop(
            `let i${i} = 0`,
            `i${i} < ${dimension.length}`,
            `i${i}++`)
    }

    symbolicSourceTemplate() {
        this.source = []

        this.source.push(`let i = 0`)
        this.source.push(...this.dimensions.map(this.loop))

        for (let i = 0; i < this.dimensions.length; i++)
            this.source.push(`this.result.data[i++] = this.dimensions[${i}][i${i}]`)

        this.source.push('}'.repeat(this.dimensions.length))
        this.source.push('return this.result')

        return this.source.join('\n')
    }

    size(all, dimension) {
        return all * dimension.length
    }

    resultant() {
        return Tensor.zeros({
            shape: [
                this.dimensions.reduce(this.size, 1),
                this.dimensions.length
            ]
        })
    }
}
