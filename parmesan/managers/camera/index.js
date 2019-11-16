import Pan from './pan'
import Look from './look'
import Zoom from './zoom'
import Project from './project'

export default class CameraManager {
    constructor() {
        this.pan = new Pan().invoke
        this.look = new Look().invoke
        this.zoom = new Zoom().invoke
        this.project = new Project().invoke
    }
}
