
export default class Engine {
    constructor(canvas) { this.context = canvas.getContext('webgl') }

    session(vertex, fragment) {
        /** Shaders */
        this.vertex = this.createShader(this.context.VERTEX_SHADER, vertex)
        this.fragment = this.createShader(this.context.FRAGMENT_SHADER, fragment)

        /** Program */
        this.context.program = this.createProgram()

        /** Uniforms */
        this.uniforms = this.createUniforms()

        /** Attributes */
        this.attributes = this.createAttributes()

        /** Usage */
        this.context.useProgram(this.context.program)

        return this
    }

    createUniforms() {
        const uniforms = {}

        const uniformCount = this.context.getProgramParameter(this.context.program, this.context.ACTIVE_UNIFORMS)

        for (let i = 0; i < uniformCount; i++) {
            const uniformInfo = this.context.getActiveUniform(this.context.program, i)
            const uniformLocation = this.context.getUniformLocation(this.context.program, uniformInfo.name)

            uniforms[uniformInfo.name] = Object.assign(uniformInfo, { uniformLocation })
            uniforms[uniformInfo.name].set = this.createUniform(uniformInfo.type, uniformLocation)
        }

        return uniforms
    }

    createUniform(type, location) {
        if (type === this.context.FLOAT_MAT2)
            return (function (array) { this.context.uniformMatrix2fv(location, false, array) }).bind(this)

        if (type === this.context.FLOAT_MAT3)
            return (function (array) { this.context.uniformMatrix3fv(location, false, array) }).bind(this)

        if (type === this.context.FLOAT_MAT4)
            return (function (array) { this.context.uniformMatrix4fv(location, false, array) }).bind(this)
    }

    createAttributes() {
        const attributes = {}

        const attributeCount = this.context.getProgramParameter(this.context.program, this.context.ACTIVE_ATTRIBUTES)

        for (var i = 0; i < attributeCount; i++) {
            const attributeInfo = this.context.getActiveAttrib(this.context.program, i)
            const attributeLocation = this.context.getAttribLocation(this.context.program, attributeInfo.name)

            attributes[attributeInfo.name] = Object.assign(attributeInfo, { attributeLocation })
            attributes[attributeInfo.name].set = this.createAttribute(attributeLocation)
        }

        return attributes
    }

    createAttribute(location) {
        return (function (data) {
            this.context.bindBuffer(this.context.ARRAY_BUFFER, data.buffer)
            this.context.enableVertexAttribArray(location)

            this.context.vertexAttribPointer(
                location,
                data.size,
                data.type,
                data.normalize,
                data.stride,
                data.offset
            )
        }).bind(this)
    }

    createBuffer(tensor) {
        const buffer = this.context.createBuffer()

        const numberType = this.mapType(tensor.header.type.array)
        const renderType = this.context.STATIC_DRAW
        const bufferType = this.context.ARRAY_BUFFER

        this.context.bindBuffer(bufferType, buffer)
        this.context.bufferData(bufferType, tensor.data, renderType)

        return {
            buffer,
            size: tensor.header.shape[1],
            count: tensor.header.shape[0],
            type: numberType,
            normalize: false,
            offset: tensor.header.offset * tensor.data.BYTES_PER_ELEMENT,
            stride: tensor.header.strides[0] * tensor.data.BYTES_PER_ELEMENT
        }
    }

    mapType(type) {
        if (type === Int8Array) { return this.context.BYTE }
        if (type === Uint8Array) { return this.context.UNSIGNED_BYTE }
        if (type === Uint8ClampedArray) { return this.context.UNSIGNED_BYTE }
        if (type === Int16Array) { return this.context.SHORT }
        if (type === Uint16Array) { return this.context.UNSIGNED_SHORT }
        if (type === Int32Array) { return this.context.INT }
        if (type === Uint32Array) { return this.context.UNSIGNED_INT }
        if (type === Float32Array) { return this.context.FLOAT }

        return null
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

        this.context.attachShader(program, this.vertex)
        this.context.attachShader(program, this.fragment)

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
