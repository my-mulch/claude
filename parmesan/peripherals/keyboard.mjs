
export default class Keyboard {
    constructor(bindings) {
        this.keys = new Set()
        this.bindings = bindings
    }

    keyup() { this.keys.clear() }
    
    keydown(event) {
        this.keys.add(event.key)

        const strokes = Array.from(this.keys).sort().join('|')
        const binding = this.bindings[strokes]

        return binding
    }
}
