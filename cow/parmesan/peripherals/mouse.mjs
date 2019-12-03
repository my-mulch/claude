
export default class Mouse {
    constructor() {
        this.position = { x: 0, y: 0 }
        this.isPressed = false
    }

    mouseup() { this.isPressed = false }

    mousedown(event) {
        this.isPressed = true

        this.position.x = event.clientX
        this.position.y = event.clientY
    }

    mousemove(event) {
        this.position.x = event.clientX
        this.position.y = event.clientY
    }
}
