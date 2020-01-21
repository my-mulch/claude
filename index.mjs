
app.engine.session(
    await io.txtread('./resources/shaders/rgb/shader.vert'),
    await io.txtread('./resources/shaders/rgb/shader.frag'),
)

const vectors = new Float32Array(1 * 10 * 3 * 3 * 2)

for (let i = 0; i < 1; i++)
    vectors.set(new shapes.Cylinder([0, 0, 0], [0, 1, 0.000001]).vertices, i * 10 * 3 * 3 * 2)


const line = bb.tensor(vectors).reshape(-1, 3)


app.plot({
    vertices: line,
    colors: bb.ones(...line.header.shape),
    sizes: bb.ones(...line.header.shape),
    mode: app.engine.context.TRIANGLES
})


app.plot({
    vertices: bb.tensor([
        [[0], [0], [-1]],
        [[0], [0], [1]],

        // [[0], [1], [0]],
        // [[0], [-1], [0]],

        [[-1], [0], [0]],
        [[1], [0], [0]],
    ]),
    colors: bb.tensor([
        [[1], [0], [0]],
        [[1], [0], [0]],

        // [[1], [0], [0]],
        // [[1], [0], [0]],

        [[1], [0], [0]],
        [[1], [0], [0]],
    ]),
    sizes: bb.ones(4, 1),
    mode: app.engine.context.LINES,
})

app.render()
