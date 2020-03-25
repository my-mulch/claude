
export default class Claude {
    static convertLayout(layout) {
        return layout.map(function (row) {
            return `"${row.join(' ')}"`
        }).join('\n')
    }

    static repeat(count) {
        return `repeat(${count}, 1fr)`
    }

    static FULL = '100%'

    constructor({ components, layout, pipes }) {
        this.pipes = pipes
        this.layout = layout
        this.components = components

        document.body.style.gridTemplateRows = Claude.repeat(this.layout.length)
        document.body.style.gridTemplateColumns = Claude.repeat(this.layout[0].length)
        document.body.style.gridTemplateAreas = Claude.convertLayout(this.layout)

        for (const [id, component] of Object.entries(this.components)) {
            component.style({ gridArea: id, width: Claude.FULL, height: Claude.FULL })
            component.resize()

            document.body.append(component.canvas)
        }

        for (const [fromId, fromMethodName, toId, toMethodName] of this.pipes) {
            const toComponent = this.components[toId]
            const fromComponent = this.components[fromId]

            const toMethod = toComponent[toMethodName]
            const fromMethod = fromComponent[fromMethodName]

            fromComponent.canvas.addEventListener(fromMethodName, function (event) {
                const result = fromMethod.call(fromComponent, event)
                toMethod.call(toComponent, result)
            })
        }
    }

}

