
app.engine.session(
    await io.txtread('./resources/shaders/rgb/shader.vert'),
    await io.txtread('./resources/shaders/rgb/shader.frag'),
)

const errors = bb.tensor(new Float32Array(await io.byteread('./errors'))).reshape(-1, 3)

app.plot({
    vertices: errors,
    colors: bb.tile([Math.random(), Math.random(), Math.random()], errors.header.shape[0]).reshape(-1, 3),
    sizes: bb.ones([errors.header.shape[0], 1]),
    mode: app.engine.context.POINTS
})

const guesses = bb.tensor(new Float32Array(await io.byteread('./guesses'))).reshape(-1, 3)

console.log(guesses)

app.plot({
    vertices: guesses,
    colors: bb.tile([0, 1, 0], guesses.header.shape[0]).reshape(-1, 3),
    sizes: bb.tensor(new Float32Array(guesses.header.shape[0]).fill(10)).reshape(-1, 1),
    mode: app.engine.context.POINTS
})

app.plot({
    vertices: bb.tensor([
        [[0], [0], [-2]], [[0], [0], [2]],
        [[0], [2], [0]], [[0], [-2], [0]],
        [[-2], [0], [0]], [[2], [0], [0]],
    ]),
    colors: bb.tensor([
        [[1], [1], [1]], [[1], [1], [1]],
        [[1], [1], [1]], [[1], [1], [1]],
        [[1], [1], [1]], [[1], [1], [1]],
    ]),
    sizes: bb.ones([6, 1]),
    mode: app.engine.context.LINES,
})

app.render()
