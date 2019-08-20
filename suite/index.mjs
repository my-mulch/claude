import { makeCaller, makeRouter } from './utils.mjs'

export default class RadleySuite {
    constructor({ hash, ...methods }) {
        this.suite = {}
        this.hash = hash
        this.methods = methods

        this.call = makeCaller(this.methods).bind(this)
        this.route = makeRouter(this.hash).bind(this)
    }

    static suite(opts) {
        return new RadleySuite(opts)
    }
}
