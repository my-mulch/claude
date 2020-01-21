
app.engine.session(
    await io.txtread('./resources/shaders/rgb/shader.vert'),
    await io.txtread('./resources/shaders/rgb/shader.frag'),
)

const cylinder = bb.tensor(new Cylinder().vertices).reshape(-1, 3)

app.plot({
    vertices: cylinder,
    colors: bb.ones(...cylinder.header.shape),
    sizes: bb.ones(...cylinder.header.shape),
    mode: app.engine.context.TRIANGLES
})

const cone = bb.tensor(new Cone([1, 0, 0], [0.5, 0, 0]).vertices).reshape(-1, 3)

app.plot({
    vertices: cone,
    colors: bb.ones(...cone.header.shape),
    sizes: bb.ones(...cone.header.shape),
    mode: app.engine.context.TRIANGLES
})

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
