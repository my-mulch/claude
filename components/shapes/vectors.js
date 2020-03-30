import Vector from './vector.js'

export default class VectorSpace {
    static base = 0.8

    constructor({
        basis = [
            [7, 0, 0],
            [0, 7, 0],
            [0, 0, 7],
        ]
    }) {
        /** Description */
        this.basis = basis
        this.cols = this.basis.length
        this.rows = this.basis[0].length

        /** Components */
        this.vectors = this.basis.map(function (vector) {
            return new Vector({ to: vector }).vertices
        })


        /** Vertices */
        this.vertices = new Float32Array(this.vectors[0].length * this.basis.length)

        /** Populate */
        for (let i = 0; i < this.vectors.length; i++) {
            this.vertices.set(this.vectors[i], i * this.vectors[i].length)
        }
    }
}
