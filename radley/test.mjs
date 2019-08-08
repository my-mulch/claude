import radley from '../main'

const A = {
    header: { shape: [4, 4], strides: [4, 1], offset: 0, size: 16, id: 'A' },
    data: new Float64Array(16).map(Math.random)
}

const B = {
    header: { shape: [4, 4], strides: [4, 1], offset: 0, size: 16, id: 'B' },
    data: new Float64Array(16).map(Math.random)
}

const R = {
    header: { shape: [4, 4], strides: [4, 1], offset: 0, size: 16, id: 'R' },
    data: new Float64Array(16)
}


const matMultSuite = radley.suite({
    default: {
        'args.R.header.size > 500': generic,
        'args.R.header.size <= 500': optimized
    },
    hash: ['args.A.header.id', 'args.B.header.id', 'args.R.header.id']
})

const args = { A, B, R, method: 'default' }

console.time('fast')
for (let i = 0; i < 1e7; i++)
    matMult(args)
console.timeEnd('fast')

console.time('slow')
for (let i = 0; i < 1e7; i++)
    matMultSuite.call(args)
console.timeEnd('slow')

console.time('glacial')
for (let i = 0; i < 1e7; i++)
    generic()(args)
console.timeEnd('glacial')



function matMult({ A, B, R }) {
    R.data[0] = A.data[0] * B.data[0] + A.data[1] * B.data[4] + A.data[2] * B.data[8] + A.data[3] * B.data[12]
    R.data[1] = A.data[0] * B.data[1] + A.data[1] * B.data[5] + A.data[2] * B.data[9] + A.data[3] * B.data[13]
    R.data[2] = A.data[0] * B.data[2] + A.data[1] * B.data[6] + A.data[2] * B.data[10] + A.data[3] * B.data[14]
    R.data[3] = A.data[0] * B.data[3] + A.data[1] * B.data[7] + A.data[2] * B.data[11] + A.data[3] * B.data[15]
    R.data[4] = A.data[4] * B.data[0] + A.data[5] * B.data[4] + A.data[6] * B.data[8] + A.data[7] * B.data[12]
    R.data[5] = A.data[4] * B.data[1] + A.data[5] * B.data[5] + A.data[6] * B.data[9] + A.data[7] * B.data[13]
    R.data[6] = A.data[4] * B.data[2] + A.data[5] * B.data[6] + A.data[6] * B.data[10] + A.data[7] * B.data[14]
    R.data[7] = A.data[4] * B.data[3] + A.data[5] * B.data[7] + A.data[6] * B.data[11] + A.data[7] * B.data[15]
    R.data[8] = A.data[8] * B.data[0] + A.data[9] * B.data[4] + A.data[10] * B.data[8] + A.data[11] * B.data[12]
    R.data[9] = A.data[8] * B.data[1] + A.data[9] * B.data[5] + A.data[10] * B.data[9] + A.data[11] * B.data[13]
    R.data[10] = A.data[8] * B.data[2] + A.data[9] * B.data[6] + A.data[10] * B.data[10] + A.data[11] * B.data[14]
    R.data[11] = A.data[8] * B.data[3] + A.data[9] * B.data[7] + A.data[10] * B.data[11] + A.data[11] * B.data[15]
    R.data[12] = A.data[12] * B.data[0] + A.data[13] * B.data[4] + A.data[14] * B.data[8] + A.data[15] * B.data[12]
    R.data[13] = A.data[12] * B.data[1] + A.data[13] * B.data[5] + A.data[14] * B.data[9] + A.data[15] * B.data[13]
    R.data[14] = A.data[12] * B.data[2] + A.data[13] * B.data[6] + A.data[14] * B.data[10] + A.data[15] * B.data[14]
    R.data[15] = A.data[12] * B.data[3] + A.data[13] * B.data[7] + A.data[14] * B.data[11] + A.data[15] * B.data[15]

    return R
}

function generic() {
    return function (args) {
        for (let r = 0; r < args.A.header.shape[0]; r++)
            for (let c = 0; c < args.B.header.shape[1]; c++)
                for (let s = 0; s < args.A.header.shape[1]; s++)
                    args.R.data[r * args.B.header.shape[1] + c] +=
                        args.A.data[r * args.A.header.strides[0] + s * args.A.header.strides[1] + args.A.header.offset] *
                        args.B.data[c * args.B.header.strides[1] + s * args.B.header.strides[0] + args.B.header.offset]

        return args.R
    }
}

function optimized(args) {
    const source = []

    for (let i = 0; i < args.A.header.shape[0]; i++) {
        for (let j = 0; j < args.B.header.shape[1]; j++) {
            const mults = []
            for (let k = 0; k < args.A.header.shape[1]; k++) {
                mults.push(`args.A.data[ ${i * args.A.header.shape[1] + k}] * args.B.data[ ${k * args.B.header.shape[1] + j}]`)
            }
            source.push(`args.R.data[${source.length}]=${mults.join('+')}`)
        }
    }

    source.push('return args.R')
    return new Function('args', source.join('\n'))
}
