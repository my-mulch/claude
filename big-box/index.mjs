import Tensor from './tensor'
import Algebra from './algebra'
import DataType from './dtype'

/** Initialize Algebras */
const algebras = [
    new Algebra({ dimensions: 1 }),
    new Algebra({ dimensions: 2, prefix: 'Complex' }),
    new Algebra({ dimensions: 4, prefix: 'Quat' }),
]

/** Initialize Data Types */
for (const algebra of algebras) {
    Tensor[algebra.prefix + 'Uint8Clamped'] = new DataType({ algebra, array: Uint8ClampedArray })
    Tensor[algebra.prefix + 'Uint8'] = new DataType({ algebra, array: Uint8Array })
    Tensor[algebra.prefix + 'Uint16'] = new DataType({ algebra, array: Uint16Array })
    Tensor[algebra.prefix + 'Uint32'] = new DataType({ algebra, array: Uint32Array })
    Tensor[algebra.prefix + 'Int8'] = new DataType({ algebra, array: Int8Array })
    Tensor[algebra.prefix + 'Int16'] = new DataType({ algebra, array: Int16Array })
    Tensor[algebra.prefix + 'Int32'] = new DataType({ algebra, array: Int32Array })
    Tensor[algebra.prefix + 'Float32'] = new DataType({ algebra, array: Float32Array })
}

export default Tensor
