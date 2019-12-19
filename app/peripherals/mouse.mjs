
export default class Mouse {
    constructor() {
        this.position = { x: 0, y: 0 }
        this.isPconfigsed = false
    }

    mouseup() { this.isPconfigsed = false }

    mousedown(event) {
        this.isPconfigsed = true

        this.position.x = event.clientX
        this.position.y = event.clientY
    }

    mousemove(event) {
        this.position.x = event.clientX
        this.position.y = event.clientY
    }
}
