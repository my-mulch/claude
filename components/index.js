
export default class Component {
    constructor() {
        /** Display */
        this.canvas = document.createElement('canvas')
    }

    style(attributes) {
        Object.assign(this.canvas.style, attributes)
    }

    resize() { }
}
