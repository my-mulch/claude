import Mouse from './peripherals/mouse.mjs'
import Keyboard from './peripherals/keyboard.mjs'
import Config from '../resources.mjs'

class Parmesan {
    constructor() {
        /** Displays */
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'main'
        
        document.body.prepend(this.canvas)

        /** Peripherals */
        this.mouse = new Mouse()
        this.keyboard = new Keyboard()

        /** Event Listeners */
        window.addEventListener('resize', this.resize)

        /** Resize */
        this.resize()
    }

    resize() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        Config.ASPECT_RATIO = this.canvas.width / this.canvas.height
    }
}

export default new Parmesan()
