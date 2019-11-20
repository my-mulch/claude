import Tensor from '../../tensor'
import TensorOperation from '../operation'

export default class LinearAlgebraOperation extends TensorOperation {
    constructor(args) {
        super(args)

        /** Dimensions */
        this.rows = this.of.shape[0]
        this.cols = this.with.shape[1]
        this.like = this.of.shape[1]
        this.size = this.rows
    }

    /** Resultant Tensor */
    resultant() { return Tensor.zeros(this.of) }

    /** Pointwise Source Implementation */
    pointwiseSourceBoilerplate() { }
    pointwiseSourceTemplate() {
        this.start()

        for (let r = 0; r < this.rows; r++)
            for (let c = 0; c < this.cols; c++)
                this.inLoop()

        this.finish()
    }

    /** (TODO) Symbolic Source Implementation */
    symbolicSourceBoilerplate() { }
    symbolicSourceTemplate() { }
}

