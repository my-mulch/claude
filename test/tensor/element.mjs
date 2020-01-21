import bb from '../../tensor/index.mjs'
import jest from '../index.mjs'

export default jest.suite(function () {
    let A, B, C, D, E

    console.log('\n\n-------- Elementwise Suite --------\n\n')
    
    B = bb.tensor([
        [[-46], [19]],
        [[-38], [9]],
        [[9], [-15]],
        [[-25], [-33]]
    ])

    E = bb.tensor([
        [[1, 1], [10, 10], [100, 100]],
        [[1, 1], [10, 10], [100, 100]],
        [[1, 1], [10, 10], [100, 100]],
        [[1, 1], [10, 10], [100, 100]],
    ])



    this.expect(B.ravel()).toEqual(["-46.00", "19.00", "-38.00", "9.00", "9.00", "-15.00", "-25.00", "-33.00"])
    this.expect(B.T().ravel()).toEqual(["-46.00", "-38.00", "9.00", "-25.00", "19.00", "9.00", "-15.00", "-33.00"])
    this.expect(E.ravel()).toEqual(["1.00+1.00i", "10.00+10.00i", "100.00+100.00i", "1.00+1.00i", "10.00+10.00i", "100.00+100.00i", "1.00+1.00i", "10.00+10.00i", "100.00+100.00i", "1.00+1.00i", "10.00+10.00i", "100.00+100.00i"])

    console.log('\n\n-------- End Elementwise Suite --------\n\n')
})
