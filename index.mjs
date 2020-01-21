
app.engine.session(
    await io.txtread('./resources/shaders/rgb/shader.vert'),
    await io.txtread('./resources/shaders/rgb/shader.frag'),
)
// const vertices = bb.tensor(await io.imread('./resources/images/froot.jpg')).reshape(-1, 3)
// const colors = vertices
// const sizes = bb.ones(vertices.header.shape[0], 1)
// const mode = app.engine.context.POINTS


// app.plot({ vertices, colors, sizes, mode })

app.plot({
    vertices: bb.tensor([
        [[0], [0], [-1]],
        [[0], [0], [1]],

        [[0], [1], [0]],
        [[0], [-1], [0]],

        [[-1], [0], [0]],
        [[1], [0], [0]],
    ]),
    colors: bb.tensor([
        [[1], [1], [1]],
        [[1], [1], [1]],

        [[1], [1], [1]],
        [[1], [1], [1]],

        [[1], [1], [1]],
        [[1], [1], [1]],
    ]),
    sizes: bb.ones(6, 1),
    mode: app.engine.context.LINES,
})

app.render()
