
export default class Component {
    constructor(listeners) {
        /** Display */
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')

        /** State */
        this.pointer = false
        this.listeners = listeners

        /** Event Listeners */
        for (const [key, value] of Object.entries(this.listeners)) {
            this[key] = value.bind(this)
            this.canvas.addEventListener(key, value.bind(this))
        }
    }
}
