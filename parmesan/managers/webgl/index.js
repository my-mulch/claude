import config from '../../resources'

export default class WebGLManager {
    constructor() {
        Object.assign(this, config)

        this.CONTEXT = document.getElementById('canvas').getContext(this.CONTEXT_WEB_GL)

        this.program = this.createProgram()
        this.uniforms = this.createUniforms()
        this.attributes = this.createAttributes()

        this.CONTEXT.useProgram(this.program)
    }

    createUniforms() {
        const uniforms = {}

        const uniformCount = this.CONTEXT.getProgramParameter(this.program, this.CONTEXT.ACTIVE_UNIFORMS)

        for (let i = 0; i < uniformCount; i++) {
            const uniformInfo = this.CONTEXT.getActiveUniform(this.program, i)
            const uniformLocation = this.CONTEXT.getUniformLocation(this.program, uniformInfo.name)

            uniforms[uniformInfo.name] = this.createUniform(uniformInfo.type, uniformLocation)
        }

        return uniforms
    }

    createUniform(type, location) {
        if (type === this.CONTEXT.FLOAT_MAT2)
            return (function (array) { this.CONTEXT.uniformMatrix2fv(location, false, array.data) }).bind(this)

        if (type === this.CONTEXT.FLOAT_MAT3)
            return (function (array) { this.CONTEXT.uniformMatrix3fv(location, false, array.data) }).bind(this)

        if (type === this.CONTEXT.FLOAT_MAT4)
            return (function (array) { this.CONTEXT.uniformMatrix4fv(location, false, array.data) }).bind(this)
    }

    createBuffer(tensor) {
        const buffer = this.CONTEXT.createBuffer()

        const numberType = this.mapType(tensor.type.typed)
        const renderType = this.CONTEXT.STATIC_DRAW
        const bufferType = this.CONTEXT.ARRAY_BUFFER

        this.CONTEXT.bindBuffer(bufferType, buffer)
        this.CONTEXT.bufferData(bufferType, tensor.data, renderType)

        return {
            buffer,
            size: tensor.shape[1],
            count: tensor.shape[0],
            type: numberType,
            normalize: false,
            offset: tensor.offset * tensor.data.BYTES_PER_ELEMENT,
            stride: tensor.strides[0] * tensor.data.BYTES_PER_ELEMENT
        }
    }

    mapType(type) {
        if (type === Int8Array) { return this.CONTEXT.BYTE }
        if (type === Uint8Array) { return this.CONTEXT.UNSIGNED_BYTE }
        if (type === Uint8ClampedArray) { return this.CONTEXT.UNSIGNED_BYTE }
        if (type === Int16Array) { return this.CONTEXT.SHORT }
        if (type === Uint16Array) { return this.CONTEXT.UNSIGNED_SHORT }
        if (type === Int32Array) { return this.CONTEXT.INT }
        if (type === Uint32Array) { return this.CONTEXT.UNSIGNED_INT }
        if (type === Float32Array) { return this.CONTEXT.FLOAT }

        return null
    }

    createAttributes() {
        const attributes = {}

        const attributeCount = this.CONTEXT.getProgramParameter(this.program, this.CONTEXT.ACTIVE_ATTRIBUTES)

        for (var i = 0; i < attributeCount; i++) {
            const attributeInfo = this.CONTEXT.getActiveAttrib(this.program, i)
            const attributeLocation = this.CONTEXT.getAttribLocation(this.program, attributeInfo.name)

            attributes[attributeInfo.name] = this.createAttribute(attributeLocation)
        }

        return attributes
    }

    createAttribute(location) {
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

    createShader(type, source) {
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

        this.CONTEXT.attachShader(program, this.createShader(
            this.CONTEXT.VERTEX_SHADER,
            this.VERTEX_SOURCE
        ))

        this.CONTEXT.attachShader(program, this.createShader(
            this.CONTEXT.FRAGMENT_SHADER,
            this.FRAGMENT_SOURCE
        ))

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
