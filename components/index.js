
export default class Component {
    constructor(attributes) {
        /** Display */
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')

        /** State */
        this.pointer = false
        this.attributes = attributes

        /** Style */
        Object.assign(this.canvas.style, this.attributes)

        /** Event Listeners */
        for (const [key, value] of Object.entries(this.attributes)) {
            if (value.constructor !== Function)
                continue

            this[key] = value.bind(this)
            this.canvas.addEventListener(key, value.bind(this))
        }
    }
}
