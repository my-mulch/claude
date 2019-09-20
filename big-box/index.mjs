import Tensor from './tensor'
import Algebra from './algebra'

/** Initialize Algebras */
const algebras = [
    new Algebra({ dimensions: 1 }),
    new Algebra({ dimensions: 2, prefix: 'Complex' }),
    new Algebra({ dimensions: 4, prefix: 'Quat' }),
    new Algebra({ dimensions: 8, prefix: 'Quat' }),
]

/** Initialize Data Types */
for (const algebra of algebras) {
    Tensor[algebra.prefix + 'Uint8Clamped'] = { algebra, array: Uint8ClampedArray }
    Tensor[algebra.prefix + 'Uint8'] = { algebra, array: Uint8Array }
    Tensor[algebra.prefix + 'Uint16'] = { algebra, array: Uint16Array }
    Tensor[algebra.prefix + 'Uint32'] = { algebra, array: Uint32Array }
    Tensor[algebra.prefix + 'Int8'] = { algebra, array: Int8Array }
    Tensor[algebra.prefix + 'Int16'] = { algebra, array: Int16Array }
    Tensor[algebra.prefix + 'Int32'] = { algebra, array: Int32Array }
    Tensor[algebra.prefix + 'Float32'] = { algebra, array: Float32Array }
}

export default Tensor
