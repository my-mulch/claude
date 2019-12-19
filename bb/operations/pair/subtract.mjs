import Algebra from '../../template/algebra.mjs'
import ZipPairOperation from './interface/zip.mjs'

export default class Subtraction extends ZipPairOperation {
    constructor(args) { super(args) }

    inLoop() {
        return Algebra.assign(this.variables.result,
            Algebra.subtract(this.variables.of, this.variables.with)).join('\n')
    }
}
