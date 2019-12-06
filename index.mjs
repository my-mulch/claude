

webgl
    .program({
        canvas: app.canvas,
        vertexSource: await io.txtread('./webgl/click/shader.vert'),
        fragmentSource: await io.txtread('./webgl/click/shader.frag'),
    }).do(function () {
        /** Attribute Locations */
        const aPosIndex = this.attributes.a_Position.attributeLocation
        const aSizeIndex = this.attributes.a_PointSize.attributeLocation

        /** Send to GPU */
        this.context.vertexAttrib1f(aSizeIndex, 80)

        /** Clear color */
        this.context.clearColor(0., 0.0, 0.0, 1.0)

        /** Mouse Clicks */
        const points = []
        app.canvas.addEventListener('mousedown', function (event) {
            const rect = event.target.getBoundingClientRect()

            const x = ((event.clientX - rect.left) - app.canvas.width / 2) / (app.canvas.width / 2)
            const y = (app.canvas.height / 2 - (event.clientY - rect.top)) / (app.canvas.height / 2)

            points.push(x, y)

            this.context.clear(this.context.COLOR_BUFFER_BIT)

            for (let i = 0; i < points.length; i += 2) {
                this.context.vertexAttrib3f(aPosIndex, points[i], points[i + 1], 0.0)
                this.context.drawArrays(this.context.POINTS, 0, 1);
            }
        }.bind(this))
    })






