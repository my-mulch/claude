import Mouse from './peripherals/mouse.mjs'
import Keyboard from './peripherals/keyboard.mjs'

import config from './resources/index.mjs'

class Parmesan {
    constructor() {
        /** Displays */
        this.canvas = document.createElement('canvas')
        this.canvas.id = 'main'
        
        document.body.prepend(this.canvas)

        /** Peripherals */
        this.mouse = new Mouse()
        this.keyboard = new Keyboard(config.BINDINGS)

        /** Event Listeners */
        window.addEventListener('resize', this.resize)

        /** Resize */
        this.resize()
    }

    resize() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight

        this.hud.width = window.innerWidth * 0.5
        this.hud.height = window.innerHeight * 0.2

        config.ASPECT_RATIO = this.canvas.width / this.canvas.height
    }
}

export default new Parmesan()
