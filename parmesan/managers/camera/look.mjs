import bb from '../../../big-box.mjs'

import config from '../../resources/index.mjs'

export default class Look {
    constructor() {
        this.negateFrom = new bb.cached.negate({ of: config.FROM })

        this.front = new bb.cached.subtract({ of: config.FROM, with: config.TO })
        this.side = new bb.cached.cross({ of: config.UP, with: this.front.result })

        this.unitSide = new bb.cached.unit({ of: this.side.result })
        this.unitFront = new bb.cached.unit({ of: this.front.result })
        this.unitUp = new bb.cached.cross({ of: this.unitFront.result, with: this.unitSide.result })

        this.assignUpFrame = new bb.cached.assign({ of: config.VIEW_MATRIX, region: [':3', '1:2'], with: this.unitUp.result })
        this.assignSideFrame = new bb.cached.assign({ of: config.VIEW_MATRIX, region: [':3', '0:1'], with: this.unitSide.result })
        this.assignFrontFrame = new bb.cached.assign({ of: config.VIEW_MATRIX, region: [':3', '2:3'], with: this.unitFront.result })
        this.assignTranslation = new bb.cached.assign({ of: config.TRANSLATION_MATRIX, region: ['3:4', ':3'], with: this.negateFrom.result.T() })

        this.look = new bb.cached.matMult({ of: config.TRANSLATION_MATRIX, with: config.VIEW_MATRIX, result: config.LOOK_MATRIX })
        this.invoke = this.invoke.bind(this)
    }

    invoke() {
        this.negateFrom.invoke()
        
        this.front.invoke()
        this.side.invoke()

        this.unitSide.invoke()
        this.unitFront.invoke()
        this.unitUp.invoke()

        this.assignUpFrame.invoke()
        this.assignSideFrame.invoke()
        this.assignFrontFrame.invoke()
        this.assignTranslation.invoke()

        return this.look.invoke()
    }
}