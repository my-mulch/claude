
export default class Claude {
    constructor({ components, shared, layout }) {
        this.shared = shared
        this.layout = layout
        this.components = components

        document.body.style.gridTemplateAreas = this.layout

        for (const component of this.components)
            document.body.append(component.canvas)
    }
}

