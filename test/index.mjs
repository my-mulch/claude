const FAIL = '\x1b[31m%s\x1b[0m'
const PASS = '\x1b[32m%s\x1b[0m'

export default class Jest {
    static suite(tests) {
        return function () {
            Jest.spec = 0
            tests.call(Jest)
        }
    }

    static expect(stuff) {
        return {
            toEqual: function (otherStuff) {
                Jest.spec = Jest.spec + 1 || 1

                if (stuff.header) stuff = stuff.toRaw()
                if (otherStuff.header) otherStuff = otherStuff.toRaw()

                stuff = stuff.constructor !== String
                    ? JSON.stringify(stuff)
                    : stuff

                otherStuff = otherStuff.constructor !== String
                    ? JSON.stringify(otherStuff)
                    : otherStuff

                if (stuff == otherStuff)
                    console.log(PASS, Jest.spec, 'Passed!')
                else
                    console.log(FAIL, Jest.spec, `Failed: expected ${stuff} to equal ${otherStuff}`)
            }
        }
    }
}
