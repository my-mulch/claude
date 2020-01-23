
app.engine.session(
    await io.txtread('./resources/shaders/rgb/shader.vert'),
    await io.txtread('./resources/shaders/rgb/shader.frag'),
)

let weight = 0.5
const goal = 0.8
const input = 0.5

function loss(weight, input, goal) {
    return (weight * input - goal) ** 2
}

function grad(weight, input, goal) {
    return 2 * input * (weight * input - goal)
}

const weights = bb.linspace(-5, 5, 10000)
const outputs = bb.zeros([10000, 3])
const grads = bb.zeros([10000, 3])

for (let i = 0, j = 0; i < weights.data.length; i++ , j += 3) {
    outputs.data[j + 0] = weights.data[i + 0]
    outputs.data[j + 1] = loss(weights.data[i + 0], input, goal)

    grads.data[j + 0] = weights.data[i + 0]
    grads.data[j + 1] = grad(weights.data[i + 0], input, goal)
}


const guesses = bb.zeros([22, 3])

// Learning
const eps = 1e-6
let i = 0

while (true) {
    const error = loss(weight, input, goal)
    const grad = input * (weight * input - goal)

    guesses.data[i++] = weight * input
    guesses.data[i++] = 0
    guesses.data[i++] = 0

    if (error < eps)
        break

    console.log(`Error: ${error} Prediction: ${weight * input}`)

    weight -= grad
}



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

app.plot({
    vertices: outputs,
    colors: bb.ones([10000, 3]),
    sizes: bb.ones([10000, 1]),
    mode: app.engine.context.POINTS
})

app.plot({
    vertices: guesses,

    colors: bb.vstack(
        bb.zeros([1, 22]),
        bb.ones([1, 22]),
        bb.zeros([1, 22]),
    ).T().reshape(-1, 3),

    sizes: bb.tensor(new Float32Array(22).fill(10)).reshape(22, 1),
    mode: app.engine.context.POINTS
})


app.plot({
    vertices: grads,
    colors: bb.vstack(
        bb.ones([1, 10000]),
        bb.zeros([1, 10000]),
        bb.zeros([1, 10000]),
    ).T().reshape(-1, 3),
    sizes: bb.ones([10000, 1]),
    mode: app.engine.context.POINTS
})

app.render()
