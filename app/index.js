
export default class Claude {
    static FULL = '100%'
    static REPEAT = function (value) {
        return `repeat(${value}, 1fr)`
    }

    constructor({ shared, layout }) {
        this.shared = shared
        this.layout = layout

        this.rows = this.layout.length
        this.cols = this.layout[0].length

        document.body.style.gridTemplateRows = Claude.REPEAT(this.rows)
        document.body.style.gridTemplateColumns = Claude.REPEAT(this.cols)

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const component = this.layout[r][c]

                component.shared = this.shared
                component.layout = this.layout

                component.canvas.style.width = Claude.FULL
                component.canvas.style.height = Claude.FULL
                component.init()

                document.body.append(component.canvas)
            }
        }
    }
}

