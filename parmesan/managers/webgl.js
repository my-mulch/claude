import config from '../../resources'

export default class WebGLManager {
    constructor() {
        Object.assign(this, config)

        this.CONTEXT = this.CANVAS.getContext(this.CONTEXT_WEB_GL)

        this.program = this.createProgram()
        this.uniforms = this.createUniforms()
        this.attributes = this.createAttributes()
    }

    createUniforms() {
        const uniforms = {}

        const uniformCount = this.CONTEXT.getProgramParameter(this.program, this.CONTEXT.ACTIVE_UNIFORMS)

        for (let i = 0; i < uniformCount; i++) {
            const uniformInfo = this.CONTEXT.getActiveUniform(this.program, i)
            const uniformLocation = this.CONTEXT.getUniformLocation(this.program, uniformInfo.name)

            uniforms[uniformInfo.name] = this.createUniform({ type: uniformInfo.type, location: uniformLocation })
        }

        return uniforms
    }

    createUniform({ type, location }) {
        if (type === this.CONTEXT.FLOAT_MAT2)
            return (function (array) { this.CONTEXT.uniformMatrix2fv(location, false, array.data) }).bind(this)

        if (type === this.CONTEXT.FLOAT_MAT3)
            return (function (array) { this.CONTEXT.uniformMatrix3fv(location, false, array.data) }).bind(this)

        if (type === this.CONTEXT.FLOAT_MAT4)
            return (function (array) { this.CONTEXT.uniformMatrix4fv(location, false, array.data) }).bind(this)
    }

    createBuffer({ array }) {
        const buffer = this.CONTEXT.createBuffer()

        const numberType = this.mapType({ array })
        const renderType = this.CONTEXT.STATIC_DRAW
        const bufferType = this.CONTEXT.ARRAY_BUFFER

        this.CONTEXT.bindBuffer(bufferType, buffer)
        this.CONTEXT.bufferData(bufferType, array.data, renderType)

        return {
            buffer,
            size: array.shape[1],
            count: array.shape[0],
            type: numberType,
            normalize: false,
            offset: array.offset * array.data.BYTES_PER_ELEMENT,
            stride: array.strides[0] * array.data.BYTES_PER_ELEMENT
        }
    }

    mapType({ array }) {
        if (array.type.typed === Int8Array) { return this.CONTEXT.BYTE }
        if (array.type.typed === Uint8Array) { return this.CONTEXT.UNSIGNED_BYTE }
        if (array.type.typed === Uint8ClampedArray) { return this.CONTEXT.UNSIGNED_BYTE }
        if (array.type.typed === Int16Array) { return this.CONTEXT.SHORT }
        if (array.type.typed === Uint16Array) { return this.CONTEXT.UNSIGNED_SHORT }
        if (array.type.typed === Int32Array) { return this.CONTEXT.INT }
        if (array.type.typed === Uint32Array) { return this.CONTEXT.UNSIGNED_INT }
        if (array.type.typed === Float32Array) { return this.CONTEXT.FLOAT }

        return null
    }

    createAttributes() {
        const attributes = {}

        const attributeCount = this.CONTEXT.getProgramParameter(this.program, this.CONTEXT.ACTIVE_ATTRIBUTES)

        for (var i = 0; i < attributeCount; i++) {
            const attributeInfo = this.CONTEXT.getActiveAttrib(this.program, i)
            const attributeLocation = this.CONTEXT.getAttribLocation(this.program, attributeInfo.name)

            attributes[attributeInfo.name] = this.createAttribute({ location: attributeLocation })
        }

        return attributes
    }

    createAttribute({ location }) {
        return (function (data) {
            this.CONTEXT.bindBuffer(this.CONTEXT.ARRAY_BUFFER, data.buffer)
            this.CONTEXT.enableVertexAttribArray(location)

            this.CONTEXT.vertexAttribPointer(
                location,
                data.size,
                data.type,
                data.normalize,
                data.stride,
                data.offset
            )
        }).bind(this)
    }

    createShader({ type, source }) {
        const shader = this.CONTEXT.createShader(type)

        this.CONTEXT.shaderSource(shader, source)
        this.CONTEXT.compileShader(shader)

        const didCompile = this.CONTEXT.getShaderParameter(shader, this.CONTEXT.COMPILE_STATUS)

        if (!didCompile) {
            console.error(`Error with compile: ${this.CONTEXT.getShaderInfoLog(shader)}`)
            this.CONTEXT.deleteShader(shader)

            return null
        }

        return shader
    }

    createProgram() {
        const program = this.CONTEXT.createProgram()

        this.CONTEXT.attachShader(program, this.createShader({
            type: this.CONTEXT.VERTEX_SHADER,
            source: this.VERTEX_SOURCE
        }))

        this.CONTEXT.attachShader(program, this.createShader({
            type: this.CONTEXT.FRAGMENT_SHADER,
            source: this.FRAGMENT_SOURCE
        }))

        this.CONTEXT.linkProgram(program)

        const didLink = this.CONTEXT.getProgramParameter(program, this.CONTEXT.LINK_STATUS)

        if (!didLink) {
            console.error(`Error with link: ${this.CONTEXT.getProgramInfoLog(program)}`)
            this.CONTEXT.deleteProgram(program)

            return null
        }

        return program
    }
}
