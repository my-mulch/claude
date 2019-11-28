const k = 8.9875517873681764e9

const grid = bb.mesh({
    of: [
        bb.arange({ start: -1, stop: 2 }).toRawFlat(),
        bb.arange({ start: -1, stop: 2 }).toRawFlat(),
        bb.arange({ start: -1, stop: 2 }).toRawFlat()
    ]
})

const charges = bb.tensor({ data: [[0.123, 0, 0, 0], [-0.532, 0.5, 0.5, 0.5]] })
const directions = grid.subtract({ with: charges.slice({ region: [0, '1:'] }) })
const distances = directions.norm({ axes: [1] })

const field = directions
    .multiply({ with: k })
    .multiply({ with: charges.slice({ region: [0, 0] }) })
