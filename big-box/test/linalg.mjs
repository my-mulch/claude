import bb from '../tensor'
import jest from '../../test'

export default jest.suite(function () {
    let A, B, C, D, E

    console.log('\n\n-------- Linear Algebra Suite --------\n\n')

    A = bb.tensor([
        ["10", "72", "91", "13"],
        ["57", "44", "49", "33"],
        ["90", "66", "23", "21"]], bb.Float32)

    B = bb.tensor([
        ["17", "11", "19"],
        ["41", "15", "11"],
        ["16", "14", "15"]], bb.Float32)

    D = bb.tensor([
        ["2", "2", "1"],
        ["4", "2", "6"],
        ["4", "2", "2"]], bb.Float32)

    C = bb.tensor([["1"], ["2"], ["3"]], bb.Float32)

    E = bb.tensor([
        [["10", "5", "2"],
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
        ["21", "2", "2"]]], bb.Float32)

    const F = bb.tensor([["72 + 91i + 13j + 57k"]], bb.QuatFloat32)
    const G = bb.tensor([["10 + 72i + 91j + 13k"]], bb.QuatFloat32)







    this.expect(bb.cross(E.slice(['1:2', 0, ':']).T(), C, bb.zeros([3, 1], bb.Int32))).toEqual([['19'], ['-170'], ['107']])
    this.expect(bb.matMult(F, G, bb.zeros([F.shape[0], G.shape[1]], bb.QuatFloat32))).toEqual([["-7756+1076i+9603j+8851k"]])
    this.expect(bb.matMult(G, F, bb.zeros([G.shape[0], F.shape[1]], bb.QuatFloat32))).toEqual([["-7756+11112i+3761j-5839k"]])
    this.expect(A.astype(bb.QuatFloat32)).toEqual([["10+72i+91j+13k"], ["57+44i+49j+33k"], ["90+66i+23j+21k"]])
    this.expect(bb.matMult(B, A, bb.zeros([B.shape[0], A.shape[1]], bb.Int32))).toEqual(([["2507", "2962", "2523", "983"], ["2255", "4338", "4719", "1259"], ["2308", "2758", "2487", "985"]]))
    this.expect(bb.matMult(B, C, bb.zeros([B.shape[0], C.shape[1]], bb.Int32))).toEqual([["96"], ["104"], ["89"]])
    this.expect(A.T()).toEqual([["10", "57", "90"], ["72", "44", "66"], ["91", "49", "23"], ["13", "33", "21"]])
    this.expect(bb.inverse(D, bb.NULL, bb.zerosLike(D))).toEqual([["-0.5", "-0.125", "0.625"], ['1', '0', "-0.5"], ['0', "0.25", "-0.25"]])
    this.expect(bb.inverse(bb.tensor([[6, 4], [5, 2]], bb.Float32), bb.NULL, bb.zeros([2, 2], bb.Float32))).toEqual([["-0.25", "0.5"], ["0.625", "-0.75"]])
    this.expect(bb.inverse(bb.tensor([[4, 1, 3, 3], [4, 0, 0, 1], [2, 3, 4, 2], [0, 0, 4, 4]], bb.Float32), bb.NULL, bb.zeros([4, 4], bb.Float32))).toEqual([["1.5", '-1', "-0.5", "-0.625"], ['-5', '4', '2', "1.75"], ['6', '-5', '-2', "-2.25"], ['-6', '5', '2', "2.5"]])
    this.expect(bb.matMult(E.slice([':', 0, ':']), C, bb.zeros([E.slice([':', 0, ':']).shape[0], C.shape[1]], bb.Int32))).toEqual([['26'], ['74'], ['109']])

    console.log('\n\n-------- End Linear Algebra Suite --------\n\n')
})
