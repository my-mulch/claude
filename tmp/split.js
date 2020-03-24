import io from './tools/io.js'
import Camera from './tools/camera.js'
import Renderer from './tools/renderer.js'
import Trackball from './tools/trackball.js'

import Claude from './app/index.js'

import Component from './components/index.js'
import TrackView from './components/track.js'

(async function main() {
    window.io = io

    new Claude({
        shared: {
            image: await io.imread('http://localhost:3000/Users/trumanpurnell/Pictures/tools.jpeg'),
        },
        layout: [[
            new Component({
                init: function () {
                    const bitmap = this.shared.image.bitmap
                    this.canvas.width = bitmap.width
                    this.canvas.height = bitmap.height
                    this.context.drawImage(bitmap, 0, 0, bitmap.width, bitmap.height)
                },
                pointermove: function (event) {
                    const bitmap = this.shared.image.bitmap
                    const xpix = Math.floor(bitmap.width * event.offsetX / this.canvas.offsetWidth)
                    const ypix = Math.floor(bitmap.height * event.offsetY / this.canvas.offsetHeight)

                    const renderer = this.layout[0][1].renderer

                    const convWidth = 7
                    const convHeight = 7

                    const relConvWidth = Math.floor(convWidth / 2)
                    const relConvHeight = Math.floor(convHeight / 2)

                    const pixels = this.shared.image.pixels
                    let positions = [], colors, sizes

                    for (let rh = -relConvHeight; rh <= relConvHeight; rh++) {
                        for (let cw = -relConvWidth; cw <= relConvWidth; cw++) {
                            const rindex = ypix + rh
                            const cindex = xpix + cw
                            const pindex = rindex * bitmap.width * 3 + cindex * 3

                            positions.push(
                                pixels[pindex + 0],
                                pixels[pindex + 1],
                                pixels[pindex + 2]
                            )
                        }
                    }

                    colors = new Float32Array(positions.slice())
                    positions = new Float32Array(positions.map(function (p) { return p - 0.5 }))
                    sizes = new Float32Array(positions.length / 3).fill(20)


                    this.shared.buffers = {
                        sizes: renderer.buffer({ array: sizes }),
                        colors: renderer.buffer({ array: colors }),
                        positions: renderer.buffer({ array: positions }),
                    }

                    this.layout[0][1].render()
                }
            }),
            new TrackView({
                init: function () {
                    this.canvas.width = window.innerWidth
                    this.canvas.height = window.innerHeight

                    /** Tools */
                    this.camera = new Camera({})
                    this.trackball = new Trackball({})
                    this.renderer = new Renderer({
                        vertex: TrackView.shaders.vertex,
                        fragment: TrackView.shaders.fragment,
                        context: this.canvas.getContext('webgl'),
                    })

                    this.camera.project()
                    this.camera.look()
                },
                render: function () {
                    this.renderer.a_Color({ buffer: this.shared.buffers.colors, size: 3 })
                    this.renderer.a_PointSize({ buffer: this.shared.buffers.sizes, size: 1 })
                    this.renderer.a_Position({ buffer: this.shared.buffers.positions, size: 3 })

                    this.renderer.u_ProjMatrix(this.camera.proj)
                    this.renderer.u_ViewMatrix(this.camera.view)
                    this.renderer.u_ModelMatrix(this.trackball.model)

                    this.renderer.draw({ mode: this.renderer.context.POINTS, count: 7 ** 2 })
                }
            })
        ]],
    })
})()