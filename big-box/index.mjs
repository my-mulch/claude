import Types from './types'
import Tensor from './tensor'
import Operations from './operations'

Object.assign(Tensor, Types)
Object.assign(Tensor, Operations)

export default Tensor
