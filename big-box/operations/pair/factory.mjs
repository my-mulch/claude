import TensorOperation from '../operation'

export default function (operation) {
    return class extends TensorOperation {
        constructor(args) {
            super(args, {
                route: function () {
                    if (this.size < 50) return this.pointwise()

                    return this.symbolic()
                },
                symbolic: function () {
                    

                }
            })
        }
    }
}
