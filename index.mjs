
app.webgl.session(
    await io.txtread('./res/shaders/rgb/shader.vert'),
    await io.txtread('./res/shaders/rgb/shader.frag'),
)

// const field = bb.tensor(circles).reshape([-1, 3])


// app.plot({
//     vertices: field,
//     colors: bb.rand(field.header.shape),
//     sizes: bb.ones(field.header.shape),
//     mode: app.webgl.context.TRIANGLES
// })

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
