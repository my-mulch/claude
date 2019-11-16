import bb from '../../../big-box'

export default class Zoom {
    constructor({ ZOOM_DELTA, TO, FROM }) {
        this.TO = TO
        this.FROM = FROM
        this.ZOOM_DELTA = ZOOM_DELTA

        this.look = new bb.subtraction({ of: this.FROM, with: this.TO })
        this.delta = new bb.multiplication({ of: this.look.result, with: this.ZOOM_DELTA })

        this.zoomInTo = new bb.subtraction({ of: this.TO, with: this.delta.result, result: this.TO })
        this.zoomInFrom = new bb.subtraction({ of: this.FROM, with: this.delta.result, result: this.FROM })

        this.zoomOutTo = new bb.addition({ of: this.TO, with: this.delta.result, result: this.TO })
        this.zoomOutFrom = new bb.addition({ of: this.FROM, with: this.delta.result, result: this.FROM })

        this.invoke = this.invoke.bind(this)
    }

    invoke(zoomOut) {
        this.look.invoke()
        this.delta.invoke()

        if (zoomOut)
            return this.zoomOut()

        return this.zoomIn()
    }

    zoomIn() {
        this.zoomInTo.invoke()
        this.zoomInFrom.invoke()
    }

    zoomOut() {
        this.zoomOutTo.invoke()
        this.zoomOutFrom.invoke()
    }

}
