import { symLoops, symIndices } from '../utils'

export default {
    'true': function (args) {
        const loopHeaders = args.meta.axesShape.map(symLoops)
        const loopIndices = symIndices(args)
        const loopClosing = '}'.repeat(args.meta.fullShape.length)

        new Function('args', [
            `const temp = new Array(${args.result.type.size})`,
            ...Algebra.assign(T, R),

            ...loopHeaders,
            ...loopIndices,
            ...loopClosing,

            'return args.result'
        ].join('\n'))
    }
}





