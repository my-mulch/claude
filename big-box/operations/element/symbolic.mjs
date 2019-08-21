
import { symLoops, symIndices } from './utils'

export default function (operation) {
    return function (args) {
        return new Function('args', [
            args.result.type[operation].preRun(),

            ...args.meta.axesShape.map(symLoops), // loop heads

            ...symIndices(args),

            args.result.type[operation].run({
                of: `ofIndex`,
                with: `withIndex`,
                result: `resultIndex`,
            }),

            '}'.repeat(args.meta.fullShape.length),

            args.result.type[operation].postRun(),

            'return args.result'

        ].join('\n'))
    }
}
