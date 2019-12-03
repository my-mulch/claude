import Tensor from '../../tensor/index.mjs'
import TensorOperation from '../operation.mjs'

export default class LinearAlgebraOperation extends TensorOperation {
    constructor(args) {
        super(args)

        /** Dimensions */
        this.rows = this.of.shape[0]
        this.cols = this.with.shape[1] || this.of.shape[1]
        this.like = this.of.shape[1]
        this.size = this.rows
    }

    /** Resultant Tensor */
    resultant() { return Tensor.zeros(this.of) }

    /** Pointwise Source Implementation */
    pointwiseSourceBoilerplate() { }
    pointwiseSourceTemplate() {
        this.start()

        for (this.r = 0; this.r < this.rows; this.r++)
            for (this.c = 0; this.c < this.cols; this.c++)
                this.inLoop()

        this.finish()
    }

    /** (TODO) Symbolic Source Implementation */
    symbolicSourceBoilerplate() { }
    symbolicSourceTemplate() { }
}

