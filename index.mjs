
app.webgl.session(
    await io.txtread('./res/shaders/rgb/shader.vert'),
    await io.txtread('./res/shaders/rgb/shader.frag'),
)


const vectors = new Float32Array(90 * 200000)

for (let i = 0; i < 200000; i++)
    vectors.set(new prim.Circle().vertices, i * 90)


const field = bb.tensor(vectors).reshape([-1, 3])

app.plot({
    vertices: field,
    colors: bb.rand(field.header.shape),
    sizes: bb.ones(field.header.shape),
    mode: app.webgl.context.TRIANGLES
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
        [[1], [0], [0]],
        [[1], [0], [0]],

        [[1], [0], [0]],
        [[1], [0], [0]],

        [[1], [0], [0]],
        [[1], [0], [0]],
    ]),
    sizes: bb.ones([6, 1]),
    mode: app.webgl.context.LINES,
})

app.render()
