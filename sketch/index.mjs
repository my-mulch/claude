
export default class Sketch {
    constructor(canvas, vertexSource, fragmentSource) {
        /** Properties */
        this.context = canvas.getContext('webgl')
        this.vertexSource = vertexSource
        this.fragmentSource = fragmentSource

        /** Shaders */
        this.vertexShader = this.createShader(this.context.VERTEX_SHADER, this.vertexSource)
        this.fragmentShader = this.createShader(this.context.FRAGMENT_SHADER, this.fragmentSource)

        /** Program */
        this.program = this.createProgram()

        /** Uniforms */
        this.uniforms = this.createVariables(this.context.ACTIVE_UNIFORMS, 'Uniform')

        /** Attributes */
        this.attributes = this.createVariables(this.context.ACTIVE_ATTRIBUTES, 'Attrib')

        /** Usage */
        this.context.useProgram(this.program)
    }

    buffer({ target, style, array }) {
        /** Create the Buffer */
        const vertexBuffer = this.context.createBuffer()

        /** Bind the Buffer to Global Target Variable */
        this.context.bindBuffer(target, vertexBuffer)

        /** Write Array into Buffer Object with Specified Draw Style */
        this.context.bufferData(target, array, style)

        /** Return Buffer Info */
        return { data: vertexBuffer, style, target }
    }

    draw({ mode, count }) {
        /** Clear Canvas */
        this.context.clear(this.context.COLOR_BUFFER_BIT)

        /** Draw the Vertices */
        this.context.drawArrays(mode, 0, count)
    }

    animate(callback) {
        requestAnimationFrame(function animator(time) {
            callback(time)

            requestAnimationFrame(animator)
        })
    }

    createVariables(type, identifier) {
        const variables = {}

        const variableCount = this.context.getProgramParameter(this.program, type)

        for (var i = 0; i < variableCount; i++) {
            const variableInfo = this.context[`getActive${identifier}`](this.program, i)
            const variableLocation = this.context[`get${identifier}Location`](this.program, variableInfo.name)

            variables[variableInfo.name] = Object.assign(variableInfo, { variableLocation })
            this[variableInfo.name] = this[`create${identifier}`](variableInfo.type, variableLocation)
        }

        return variables
    }

    createUniform(type, location) {
        /** Matrices */
        if (type === this.context.FLOAT_MAT2)
            return (function (array) { this.context.uniformMatrix2fv(location, false, array) }).bind(this)

        if (type === this.context.FLOAT_MAT3)
            return (function (array) { this.context.uniformMatrix3fv(location, false, array) }).bind(this)

        if (type === this.context.FLOAT_MAT4)
            return (function (array) { this.context.uniformMatrix4fv(location, false, array) }).bind(this)

        /** Scalars */
        if (type === this.context.FLOAT)
            return (function (float) { this.context.uniform1f(location, float) }).bind(this)
    }

    createAttrib(_, location) {
        return (function ({ size, type, offset, stride, buffer }) {
            this.context.bindBuffer(buffer.target, buffer.data)
            this.context.enableVertexAttribArray(location)
            this.context.vertexAttribPointer(location, size, type, false, stride, offset)
        }).bind(this)
    }

    createShader(type, source) {
        const shader = this.context.createShader(type)

        this.context.shaderSource(shader, source)
        this.context.compileShader(shader)

        const didCompile = this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)

        if (!didCompile) {
            console.error(`Error with compile: ${this.context.getShaderInfoLog(shader)}`)
            this.context.deleteShader(shader)

            return null
        }

        return shader
    }

    createProgram() {
        const program = this.context.createProgram()

        this.context.attachShader(program, this.vertexShader)
        this.context.attachShader(program, this.fragmentShader)

        this.context.linkProgram(program)

        const didLink = this.context.getProgramParameter(program, this.context.LINK_STATUS)

        if (!didLink) {
            console.error(`Error with link: ${this.context.getProgramInfoLog(program)}`)
            this.context.deleteProgram(program)

            return null
        }

        return program
    }
}
