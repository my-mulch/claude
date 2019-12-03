import Pan from './pan.mjs'
import Look from './look.mjs'
import Zoom from './zoom.mjs'
import Project from './project.mjs'

export default class CameraManager {
    constructor() {
        this.pan = new Pan().invoke
        this.look = new Look().invoke
        this.zoom = new Zoom().invoke
        this.project = new Project().invoke
    }
}
