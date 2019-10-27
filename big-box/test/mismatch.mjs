import bb from '..'
import jest from '../../test'

export default jest.suite(function () {

    console.log('\n\n-------- Mismatch Suite --------\n\n')

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




    this.expect(A.multiply({ with: 10 })).toEqual([['100+20i'], ['400+30i'], ['500+10i']])
    this.expect(K.multiply({ with: D })).toEqual([["0", "4+2i", "8+16i", "27+21i"], ["0", "9+2i", "8+8i", "12+24i"], ["0", "4+3i", "10+2i", "21+21i"], ["0", "7+3i", "6+10i", "21+9i"]])

    console.log('\n\n-------- End Mismatch Suite --------\n\n')
})
