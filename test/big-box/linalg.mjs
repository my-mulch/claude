import bb from '../../big-box'
import jest from '..'

export default jest.suite(function () {
    let A, B, C, D, E

    console.log('\n\n-------- Linear Algebra Suite --------\n\n')

    A = bb.array({
        with: [
            ["10", "72", "91", "13"],
            ["57", "44", "49", "33"],
            ["90", "66", "23", "21"]
        ],
        type: bb.Float32
    })

    B = bb.array({
        type: bb.Float32,
        with: [
            ["17", "11", "19"],
            ["41", "15", "11"],
            ["16", "14", "15"]
        ]
    })

    D = bb.array({
        type: bb.Float32,
        with: [
            ["2", "2", "1"],
            ["4", "2", "6"],
            ["4", "2", "2"]
        ]
    })

    C = bb.array({ with: [["1"], ["2"], ["3"]], type: bb.Float32 })

    E = bb.array({
        with: [[["10", "5", "2"],
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
        type: bb.Float32
    })

    const F = bb.array({ with: [["72 + 91i + 13j + 57k"]], type: bb.QuatFloat32 })
    const G = bb.array({ with: [["10 + 72i + 91j + 13k"]], type: bb.QuatFloat32 })

    this.expect(F.matMult({ with: G, type: bb.QuatFloat32 })).toEqual([["-7756 + 1076i + 9603j + 8851k"]])
    this.expect(G.matMult({ with: F, type: bb.QuatFloat32 })).toEqual([["-7756 + 11112i + 3761j - 5839k"]])

    this.expect(A.astype({ type: bb.QuatFloat32 })).toEqual([["10 + 72i + 91j + 13k"], ["72 + 91i + 13j + 57k"], ["91 + 13i + 57j + 44k"]])

    this.expect(B.matMult({ with: A })).toEqual(([["2507", "2962", "2523", "983"], ["2255", "4338", "4719", "1259"], ["2308", "2758", "2487", "985"]]))
    this.expect(B.matMult({ with: C })).toEqual([["96"], ["104"], ["89"]])

    this.expect(A.T()).toEqual([["10", "57", "90"], ["72", "44", "66"], ["91", "49", "23"], ["13", "33", "21"]])

    this.expect(D.inverse()).toEqual([["-0.5", "-0.125", "0.625"], ['1', '0', "-0.5"], ['0', "0.25", "-0.25"]])
    this.expect(bb.array({ with: [[6, 4], [5, 2]] }).inverse()).toEqual([["-0.25", "0.5"], ["0.625", "-0.75"]])
    this.expect(bb.array({ with: [[4, 1, 3, 3], [4, 0, 0, 1], [2, 3, 4, 2], [0, 0, 4, 4]] }).inverse()).toEqual([["1.5", '-1', "-0.5", "-0.625"], ['-5', '4', '2', "1.75"], ['6', '-5', '-2', "-2.25"], ['-6', '5', '2', "2.5"]])

    this.expect(E.slice({ with: ['1:2', 0, ':'] }).cross({ with: C })).toEqual([['19'], ['-170'], ['107']])
    this.expect(E.slice({ with: [':', 0, ':'] }).matMult({ with: C })).toEqual([['26'], ['74'], ['109']])

    console.log('\n\n-------- End Linear Algebra Suite --------\n\n')
})
