import bb from '../../../big-box'

import config from '../../resources'

export default class Look {
    constructor() {
        this.front = new bb.subtraction({ of: config.FROM, with: config.TO })
        this.negateFront = new bb.negation({ of: this.front.result })
        this.side = new bb.cross({ of: config.UP, with: this.front.result })

        this.unitSide = new bb.unit({ of: this.side.result })
        this.unitFront = new bb.unit({ of: this.front.result })
        this.unitUp = new bb.cross({ of: this.unitFront.result, with: this.unitSide.result })

        this.assignUpFrame = new bb.assignment({ of: config.VIEW_MATRIX, region: [':3', '1:2'], with: this.unitUp.result })
        this.assignSideFrame = new bb.assignment({ of: config.VIEW_MATRIX, region: [':3', '0:1'], with: this.unitSide.result })
        this.assignFrontFrame = new bb.assignment({ of: config.VIEW_MATRIX, region: [':3', '2:3'], with: this.unitFront.result })
        this.assignTranslation = new bb.assignment({ of: config.TRANSLATION_MATRIX, region: ['3:4', ':3'], with: this.negateFront.result.T() })

        this.look = new bb.matMult({ of: config.TRANSLATION_MATRIX, with: config.VIEW_MATRIX })

        this.invoke = this.invoke.bind(this)
    }

    invoke() {
        this.front.invoke()
        this.side.invoke()
        this.negateFront.invoke()

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