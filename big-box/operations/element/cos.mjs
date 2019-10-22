import Algebra from '../../algebra'
import ElementOperation from './operation'

export default new ElementOperation(function () {
    return { inside: Algebra.assign(this.R, Algebra.cos(this.A)) }
})
