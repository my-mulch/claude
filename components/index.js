
export default class Component {
    constructor() {
        /** Display */
        this.canvas = document.createElement('canvas')
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
    }

    style(attributes) {
        Object.assign(this.canvas.style, attributes)
    }

    resize() { }
}
