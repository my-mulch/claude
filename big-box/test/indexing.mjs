import bb from '../tensor'
import jest from '../../test'

export default jest.suite(function () {
    let A

    console.log('\n\n-------- Indexing Suite --------\n\n')

    A = bb.array({
        with: [[[10, 5, 2],
        [72, 6, 3],
        [91, 6, 1],
        [13, 4, 12]],

        [[57, 7, 1],
        [44, 2, 2],
        [49, 8, 4],
        [33, 8, 5]],

        [[90, 2, 5],
        [66, 4, 3],
        [23, 1, 2],
        [21, 2, 2]]]
    })

    this.expect(A.slice({ with: [0, 0, 0] })).toEqual("10")

    this.expect(A.slice({ with: [':', "0", ':'] }))
        .toEqual([
            ["10", "5", "2"],
            ["57", "7", "1"],
            ["90", "2", "5"]
        ])

    this.expect(A.slice({ with: [':', "0", ':'] }).T())
        .toEqual([
            ["10", "57", "90"],
            ["5", "7", "2"],
            ["2", "1", "5"]])

    this.expect(A.slice({ with: ["1", ':3', ':'] }))
        .toEqual([
            ["57", "7", "1"],
            ["44", "2", "2"],
            ["49", "8", "4"]
        ])

    A.assign({ region: [':', "0", ':'], with: "1" })

    this.expect(A)
        .toEqual([
            [["1", "1", "1"],
            ["72", "6", "3"],
            ["91", "6", "1"],
            ["13", "4", "12"]],

            [["1", "1", "1"],
            ["44", "2", "2"],
            ["49", "8", "4"],
            ["33", "8", "5"]],

            [["1", "1", "1"],
            ["66", "4", "3"],
            ["23", "1", "2"],
            ["21", "2", "2"]]])


    console.log('\n\n-------- End Indexing Suite --------\n\n')
})