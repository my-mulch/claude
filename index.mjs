
app.webgl.session(
    await io.txtread('./res/shaders/rgb/shader.vert'),
    await io.txtread('./res/shaders/rgb/shader.frag'),
)

const circle = bb.tensor(new prim.Circle().vertices).reshape([-1, 3])

app.plot({
    vertices: circle,
    colors: bb.ones(circle.header.shape),
    sizes: bb.ones(circle.header.shape),
    mode: app.webgl.context.TRIANGLES
})

app.render()
