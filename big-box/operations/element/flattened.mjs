
import { litComp } from './utils'

export default function (operation) {
    return function (args) {
        return new Function('args', [
            args.result.type[operation].preRun(),

            'for(let i = 0; i < this.indices.result.length; i++){',

            args.result.type[operation].run({
                of: `this.indices.of[i]`,
                with: `this.indices.with[i]`,
                result: `this.indices.result[i]`
            }),

            '}',

            args.result.type[operation].postRun(),

            'return args.result'

        ].join('\n')).bind({ indices: litComp(args) })
    }
}
