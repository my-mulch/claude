import Algebra from '../../template/algebra.mjs'
import ZipPairOperation from './interface/zip.mjs'

export default class Division extends ZipPairOperation {
    constructor(args) { super(args) }

    inLoop() {
        return Algebra.divide(
            this.variables.result, 
            this.variables.of, 
            this.variables.with)
    }
}
