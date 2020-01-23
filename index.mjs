
app.engine.session(
    await io.txtread('./resources/shaders/rgb/shader.vert'),
    await io.txtread('./resources/shaders/rgb/shader.frag'),
)

function loss(weight, input, goal) {
    return (dot(weight, input) - goal) ** 2
}

function gradient(weight, input, goal) {
    return [
        2 * input[0] * (dot(weight, input) - goal),
        2 * input[1] * (dot(weight, input) - goal),
    ]
}

function dot(a, b) {
    let dp = 0

    for (let i = 0; i < a.length; i++)
        dp += a[i] * b[i]

    return dp
}

// Visual
const weight_space = bb.mesh(
    bb.linspace(-20, 20, 1000).toRawArray(),
    bb.linspace(-20, 20, 1000).toRawArray(),
).reshape(-1, 2)

const guesses = bb.zeros([1700, 3])
const guesses_w = bb.zeros([1700, 3])
const outputs = bb.zeros([1000 ** 2, 3])


const inputs = [0.1, 0.21]
const weights = [Math.random(), Math.random()]
const weights_w = [Math.random(), Math.random()]
const goal = -1.234
const alpha = 0.1



for (let i = 0, j = 0; i < 1000 ** 2 * 2; i += 2, j += 3) {
    outputs.data[j + 0] = weight_space.data[i + 0]
    outputs.data[j + 1] = loss([weight_space.data[i + 0], weight_space.data[i + 1]], inputs, goal)
    outputs.data[j + 2] = weight_space.data[i + 1]
}

app.plot({
    vertices: outputs,
    colors: bb
        .tile([Math.random(), Math.random(), Math.random()], outputs.header.shape[0])
        .reshape(outputs.header.shape[0], 3),
    sizes: bb.ones(outputs.header.shape),
    mode: app.engine.context.POINTS
})

// Learning

let i = 0
while (i < 1700) {
    const error = loss(weights, inputs, goal)
    const grad = gradient(weights, inputs, goal)

    const error_w = loss(weights_w, inputs, goal)
    const grad_w = gradient(weights_w, inputs, goal)

    guesses.data[i * 3 + 0] = weights[0]
    guesses.data[i * 3 + 1] = error
    guesses.data[i * 3 + 2] = weights[1]

    guesses_w.data[i * 3 + 0] = weights_w[0]
    guesses_w.data[i * 3 + 1] = error_w
    guesses_w.data[i * 3 + 2] = weights_w[1]

    console.log(
        `Error: ${error.toFixed(4)} Prediction: ${dot(weights, inputs).toFixed(4)}`,
        `Error_w: ${error_w.toFixed(4)} Prediction_w: ${dot(weights_w, inputs).toFixed(4)}`
    )

    weights[0] -= alpha * grad[0]
    weights[1] -= alpha * grad[1]

    weights_w[0] -= alpha * grad_w[0]
    // weights_w[1] -= alpha * grad_w[1]

    i++
}

app.plot({
    vertices: guesses,
    colors: bb.tile([Math.random(), Math.random(), Math.random()], 1700).reshape(10, 3),
    sizes: bb.tensor(new Float32Array(1700).fill(10)).reshape(-1, 1),
    mode: app.engine.context.POINTS
})

app.plot({
    vertices: guesses_w,
    colors: bb.tile([1, 0, 0], 1700).reshape(10, 3),
    sizes: bb.tensor(new Float32Array(1700).fill(10)).reshape(-1, 1),
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
