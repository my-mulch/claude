
import { litComp } from './utils'

export default function (operation) {
    return function (args) {
        let indices = litComp(args)

        const pointWiseFunction = new Function('args', [
            args.result.type[operation].preRun(),

            [...new Array(args.meta.fullSize).keys()].map(function (i) {
                return args.result.type[operation].run({
                    of: `${indices.of[i]}`,
                    with: `${indices.with[i]}`,
                    result: `${indices.result[i]}`,
                })
            }).join('\n'),

            args.result.type[operation].postRun(),

            'return args.result'

        ].join('\n'))

        indices = null

        return pointWiseFunction
    }
}
