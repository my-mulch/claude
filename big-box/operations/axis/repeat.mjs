import bb from '../../tensor'
import Header from '../../header'
import Template from '../../template'

export default class Repeat {
    constructor(A, B, R, { axes, count }) {
        /** Repeat count */
        this.count = count || 1

        /** Axes */
        this.axes = {}
        this.axes.inner = axes || []
        this.axes.total = [...A.shape.keys()]
        this.axes.outer = bb.difference(this.axes.total, this.axes.inner)
        this.axes.order = this.axes.outer.concat(this.axes.inner)
        this.axes.last = this.axes.order[this.axes.order.length - 1]
        this.axes.repeat = this.axes.inner[0]

        /** Tensors */
        this.tensors = {}
        this.tensors.A = A
        this.tensors.R = R || this.resultant()

        /** Dimensions */
        this.dimensions = {}
        this.dimensions.A = Header.strides(this.tensors.A.shape, this.tensors.A.type)
        this.dimensions.R = Header.strides(this.tensors.R.shape, this.tensors.R.type)

        /** Loops */
        this.loops = {}
        this.loops.outer = Template.loopAxes(this.axes.outer, this.tensors.A)
        this.loops.inner = Template.loopAxes(this.axes.inner, this.tensors.A)
        this.loops.count = Template.loop(['let c=0', `let r=i${this.axes.last}*${this.count}`], [`c<${this.count}`], ['r++', 'c++'])

        /** Strides */
        this.strides = {}
        this.strides.A = this.tensors.A.strides
        this.strides.R = this.axes.inner.length ? this.tensors.R.strides : this.dimensions.R

        /** Scalars */
        this.scalars = {}
        this.scalars.A = this.axes.total.map(Template.prefix)
        this.scalars.R = this.axes.total.map(function (axis) { return axis === this.axes.repeat ? 'r' : Template.prefix(axis) }, this)

        /** Indices */
        this.indices = {}
        this.indices.A = Template.index('AIndex', this.scalars.A, this.strides.A, this.tensors.A.offset)
        this.indices.R = Template.index('RIndex', this.scalars.R, this.strides.R, this.tensors.R.offset)

        /** Source */
        this.source = [
            ...this.loops.outer,

            this.indices.R,

            ...this.loops.inner,

            this.indices.A,

            `for(let c = 0, r = i${this.axes.order.slice(-1).pop()} * ${this.count}; c < ${this.count}; r++, c++){`,
            `var a = ${this.dimensions[0]} * i0 + ${this.dimensions[1]} * i1 + ${this.dimensions[2]} * r`,
            // RIndex + r * R.strides[${this.axes.inner[0]}]
            `console.log(a)`,
            // `${this.axes.inner.length === 0
            //     ? `console.log(RIndex + (${this.count} * i${this.axes.outer[this.axes.outer.length - 1]} + r) * R.strides[0])`
            //     : `console.log(RIndex + (${this.count} * i${this.axes.inner[0]} + r) * R.strides[${this.axes.inner[0]}])`
            // }`,

            `}`,
            `}`.repeat(this.loops.inner.length),
            `}`.repeat(this.loops.outer.length),

        ].join('\n')

        this.operation = new Function('A,B,R,args', this.source)
    }

    static get() { return null }

    static set(A, B, R, meta) {
        const repeat = new Repeat(A, B, R, meta)

        return repeat.operation.bind(
            null,
            repeat.tensors.A,
            repeat.tensors.B,
            repeat.tensors.R,
            meta)
    }

    resultant() {
        if (!this.axes.inner.length)
            return bb.zeros({
                type: this.tensors.A.type,
                shape: [this.tensors.A.size * this.count]
            })

        return bb.zeros({
            type: this.tensors.A.type,
            shape: this.tensors.A.shape.map(function (value, axis) {
                return axis === this.axes.inner[0] ? this.count * value : value
            }, this)
        })
    }

}
