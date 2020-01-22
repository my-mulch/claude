
app.engine.session(
    await io.txtread('./resources/shaders/rgb/shader.vert'),
    await io.txtread('./resources/shaders/rgb/shader.frag'),
)


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
    sizes: bb.ones([6, 1]),
    mode: app.engine.context.LINES,
})


const cylinder = bb.tensor(new Cylinder().vertices).reshape(-1, 3)

app.plot({
    vertices: cylinder,
    colors: bb.vstack(bb.ones([1, cylinder.header.shape[0]]), bb.zeros([2, cylinder.header.shape[0]])).T().reshape(-1, 3),
    sizes: bb.ones(cylinder.header.shape),
    mode: app.engine.context.TRIANGLES
})

const cone = bb.tensor(new Cone([1, 0, 0], [0.5, 0, 0]).vertices).reshape(-1, 3)

app.plot({
    vertices: cone,
    colors: bb.vstack(bb.zeros([2, cone.header.shape[0]]), bb.ones([1, cone.header.shape[0]])).T().reshape(-1, 3),
    sizes: bb.ones(cone.header.shape),
    mode: app.engine.context.TRIANGLES
})

app.render()
