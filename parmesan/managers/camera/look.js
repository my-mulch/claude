
export default class LookAt {
    constructor() {
        this.viewMatrix = bb.eye({ shape: [4, 4], type: bb.Float32 })
        this.transMatrix = bb.eye({ shape: [4, 4], type: bb.Float32 })

        this.front = new bb.subtraction({ of: this.FROM, with: this.TO })
        this.side = new bb.cross({ of: this.UP, with: this.front.result })

        this.unitSide = new bb.unit({ of: this.side.result })
        this.unitFront = new bb.unit({ of: this.front.result })
        this.unitUp = new bb.cross({ of: this.unitFront.result, with: this.unitSide.result })

        this.assignUpFrame = new bb.assignment({ of: this.viewMatrix.slice({ region: [':3', '1:2'] }), with: this.unitUp.result })
        this.assignSideFrame = new bb.assignment({ of: this.viewMatrix.slice({ region: [':3', '0:1'] }), with: this.unitSide.result })
        this.assignFrontFrame = new bb.assignment({ of: this.viewMatrix.slice({ region: [':3', '2:3'] }), with: this.unitFront.result })

        this.assignTranslation = new bb.assignment({ of: this.transMatrix.slice({ region: ['3:4', ':3'] }), with: this.FROM.negate().T() })

        this.createLookAtMatrix = new bb.matMult({ of: this.transMatrix, with: this.viewMatrix })

        this.lookAt = new bb.chain([
            this.createSideFrame,
            this.createFrontFrame,
            this.createUpFrame,

            this.assignUpFrame,
            this.assignSideFrame,
            this.assignFrontFrame,
            this.assignTranslation,

            this.createLookAtMatrix
        ])
    }
}