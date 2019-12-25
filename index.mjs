
window.cow = new app(
    await io.txtread('./res/shaders/rgb/shader.vert'),
    await io.txtread('./res/shaders/rgb/shader.frag'))

const colors = bb.tensor(await io.imread('./res/images/froot.jpg')).reshape([-1, 3])
const vertices = colors.subtract({ with: 0.5 })
const sizes = bb.ones(colors.header.shape).multiply({ with: 1 })

const axes = bb.tensor([
    // [[0], [0], [0]],
    // [[-0.23570226], [0.94280904], [-0.23570226]],

    // [[0], [0], [0]],
    // [[0.23570226], [-0.94280904], [0.23570226]],

    // [[-0.70710678], [0.], [0.70710678]],
    // [[0], [0], [0]],

    // [[0.70710678], [0.], [-0.70710678]],
    // [[0], [0], [0]],

    [[0], [0], [-1]],
    [[0], [0], [1]],

    [[0], [-1], [0]],
    [[0], [1], [0]],

    [[-1], [0], [0]],
    [[1], [0], [0]],
])

const a_colors = bb.tensor([
    // [[1], [1], [1]],
    // [[1], [1], [1]],

    // [[1], [1], [1]],
    // [[1], [1], [1]],

    // [[1], [1], [1]],
    // [[1], [1], [1]],

    // [[1], [1], [1]],
    // [[1], [1], [1]],

    [[1], [1], [1]],
    [[1], [1], [1]],

    [[1], [1], [1]],
    [[1], [1], [1]],

    [[1], [1], [1]],
    [[1], [1], [1]],
])

cow.plot([{ vertices, colors, sizes }])
cow.plot([{ vertices: axes, mode: cow.webgl.context.LINES, colors: a_colors }])

cow.render()
