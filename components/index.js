
export default class Component {
    constructor(attributes) {
        /** Display */
        this.canvas = document.createElement('canvas')
        this.context = this.canvas.getContext('2d')

        /** State */
        this.pointer = false
        this.attributes = attributes

        /** Style */
        Object.assign(this.canvas.style, {
            width: '100%',
            height: '100%'
        })
    }
}
