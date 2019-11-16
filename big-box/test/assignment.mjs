import bb from '..'
import jest from '../../test'

export default jest.suite(function () {

    console.log('\n\n-------- Assignment Suite --------\n\n')

    const A = bb.tensor({
        data: [
            ['10 + 2i'],
            ['40 + 3i'],
            ['50 + i']
        ]
    })

    const D = bb.tensor({ data: [['0', '1', '2', '3']] })

    const K = bb.tensor({
        data: [
            ['5. + 3i', '4. + 2i', '4. + 8i', '9. + 7i'],
            ['4. + 7i', '9. + 2i', '4. + 4i', '4. + 8i'],
            ['3. + 1i', '4. + 3i', '5. + 1i', '7. + 7i'],
            ['4. + 5i', '7. + 3i', '3. + 5i', '7. + 3i']
        ],
    })

    const J = bb.tensor({ data: [[1, 2], [3, 4]] })



    this.expect(new bb.multiplication({ of: bb.linspace({ start: 0, stop: 2 * Math.PI, num: 2 }), with: 'i' }).invoke()).toEqual(["0", "3.1415927410125732i"])
    this.expect(new bb.repeat({ of: J, count: 2, axes: [0] }).invoke()).toEqual([["1", "2"], ["1", "2"], ["3", "4"], ["3", "4"]])
    this.expect(new bb.assignment({ of: bb.zeros({ shape: [1, 3] }), region: [':', ':2'], with: 255 }).invoke()).toEqual([["255", "255", "0"]])
    this.expect(new bb.assignment({ of: bb.zeros({ shape: [1, 3] }), region: [':', 1], with: 255 }).invoke()).toEqual([["0", "255", "0"]])
    this.expect(new bb.negation({ of: bb.ones({ shape: [2, 2] }) }).invoke()).toEqual([["-1", "-1"], ["-1", "-1"]])
    this.expect(new bb.assignment({ of: bb.zeros({ shape: [3, 3] }), region: [":", 1], with: 1 }).invoke()).toEqual([["0", "1", "0"], ["0", "1", "0"], ["0", "1", "0"]])
    this.expect(new bb.exponential({ of: `${Math.PI}i` }).invoke()).toEqual("-1-8.742277657347586e-8i")
    this.expect(new bb.multiplication({ of: A, with: 10 }).invoke()).toEqual([['100+20i'], ['400+30i'], ['500+10i']])
    this.expect(new bb.multiplication({ of: K, with: D }).invoke()).toEqual([["0", "4+2i", "8+16i", "27+21i"], ["0", "9+2i", "8+8i", "12+24i"], ["0", "4+3i", "10+2i", "21+21i"], ["0", "7+3i", "6+10i", "21+9i"]])
    this.expect(new bb.repeat({ of: [[1], [2], [3]], count: 3, axes: [1] }).invoke()).toEqual([["1", "1", "1"], ["2", "2", "2"], ["3", "3", "3"]])


    console.log('\n\n-------- End Mismatch Suite --------\n\n')
})
