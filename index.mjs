
app.webgl.session(
    await io.txtread('./res/shaders/rgb/shader.vert'),
    await io.txtread('./res/shaders/rgb/shader.frag'),
)

// const vectors = new Float32Array(7 * 3 * 3 * 1e6)

// for (let i = 0; i < 1e6; i++)
//     vectors.set(new app.shapes.Cone().vertices, i * 7 * 3 * 3)


// const field = bb.tensor(vectors).reshape([-1, 3])

// app.plot({
//     vertices: field,
//     colors: bb.rand(field.header.shape),
//     sizes: bb.ones(field.header.shape),
//     mode: app.webgl.context.TRIANGLES
// })



const cyl = bb.tensor(new app.shapes.Cylinder([0, 0, 0], [0, 1, 0.0001]).vertices).reshape([-1, 3])

app.plot({
    vertices: cyl,
    colors: bb.ones(cyl.header.shape),
    sizes: bb.ones(cyl.header.shape),
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
