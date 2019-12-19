import Algebra from '../../template/algebra.mjs'
import ZipPairOperation from './interface/zip.mjs'

export default class Addition extends ZipPairOperation {
    constructor(args) { super(args) }

    inLoop() {
        return Algebra.assign(this.variables.result,
            Algebra.add(this.variables.of, this.variables.with)).join('\n')
    }
}
