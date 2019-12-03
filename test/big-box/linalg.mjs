import bb from '..'
import jest from '../../test'

export default jest.suite(function () {
    let A, B, C, D, E

    console.log('\n\n-------- Linear Algebra Suite --------\n\n')

    A = bb.tensor({
        data: [
            ["10", "72", "91", "13"],
            ["57", "44", "49", "33"],
            ["90", "66", "23", "21"]
        ],
    })

    B = bb.tensor({

        data: [
            ["17", "11", "19"],
            ["41", "15", "11"],
            ["16", "14", "15"]
        ]
    })

    D = bb.tensor({

        data: [
            ["2", "2", "1"],
            ["4", "2", "6"],
            ["4", "2", "2"]
        ]
    })

    C = bb.tensor({ data:[["1"], ["2"], ["3"]], })

    E = bb.tensor({
        data: [[["10", "5", "2"],
        ["72", "6", "3"],
        ["91", "6", "1"],
        ["13", "4", "12"]],

        [["57", "7", "1"],
        ["44", "2", "2"],
        ["49", "8", "4"],
        ["33", "8", "5"]],

        [["90", "2", "5"],
        ["66", "4", "3"],
        ["23", "1", "2"],
        ["21", "2", "2"]]],
    })

    const F = bb.tensor({ data:[["72 + 91i + 13j + 57k"]], })
    const G = bb.tensor({ data:[["10 + 72i + 91j + 13k"]], })





    this.expect(new bb.cached.matMult({ of: F, with: G }).invoke()).toEqual([["-7756+1076i+9603j+8851k"]])
    this.expect(new bb.cached.matMult({ of: G, with: F }).invoke()).toEqual([["-7756+11112i+3761j-5839k"]])
    this.expect(new bb.cached.matMult({ of: B, with: A }).invoke()).toEqual(([["2507", "2962", "2523", "983"], ["2255", "4338", "4719", "1259"], ["2308", "2758", "2487", "985"]]))
    this.expect(new bb.cached.matMult({ of: B, with: C }).invoke()).toEqual([["96"], ["104"], ["89"]])
    this.expect(A.T()).toEqual([["10", "57", "90"], ["72", "44", "66"], ["91", "49", "23"], ["13", "33", "21"]])
    this.expect(new bb.cached.inverse({ of: D }).invoke()).toEqual([["-0.5", "-0.125", "0.625"], ['1', '0', "-0.5"], ['0', "0.25", "-0.25"]])
    this.expect(new bb.cached.inverse({ of: [[6, 4], [5, 2]] }).invoke()).toEqual([["-0.25", "0.5"], ["0.625", "-0.75"]])
    this.expect(new bb.cached.inverse({ of: [[4, 1, 3, 3], [4, 0, 0, 1], [2, 3, 4, 2], [0, 0, 4, 4]] }).invoke()).toEqual([["1.5", '-1', "-0.5", "-0.625"], ['-5', '4', '2', "1.75"], ['6', '-5', '-2', "-2.25"], ['-6', '5', '2', "2.5"]])
    this.expect(new bb.cached.cross({ of: E.slice({ region: ['1:2', 0, ':'] }).T(), with: C }).invoke()).toEqual([['19'], ['-170'], ['107']])
    this.expect(new bb.cached.matMult({ of: E.slice({ region: [':', 0, ':'] }), with: C }).invoke()).toEqual([['26'], ['74'], ['109']])

    console.log('\n\n-------- End Linear Algebra Suite --------\n\n')
})
