

window.cow = new app(
    await io.txtread('./webgl/main/shader.vert'),
    await io.txtread('./webgl/main/shader.frag'))

cow.plot([{ vertices: bb.rand([1e6, 3]) }])

cow.render()
