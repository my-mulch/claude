import Pan from './pan'
import Look from './look'
import Zoom from './zoom'
import Project from './project'

import config from '../../resources'

export default class CameraManager {
    constructor() {
        Object.assign(this, config)
        
        this.pan = new Pan(this).invoke
        this.look = new Look(this).invoke
        this.zoom = new Zoom(this).invoke
        this.project = new Project(this).invoke
    }
}
