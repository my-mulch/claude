

window.cow = new app(
    await io.txtread('./webgl/main/shader.vert'),
    await io.txtread('./webgl/main/shader.frag'))

cow.webgl.do(function () {
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3

    var verticesColors = new Float32Array([
        // Vertex coordinates and color
        1.0, 1.0, 1.0, 1.0, 1.0, 1.0,  // v0 White
        -1.0, 1.0, 1.0, 1.0, 0.0, 1.0,  // v1 Magenta
        -1.0, -1.0, 1.0, 1.0, 0.0, 0.0,  // v2 Red
        1.0, -1.0, 1.0, 1.0, 1.0, 0.0,  // v3 Yellow
        1.0, -1.0, -1.0, 0.0, 1.0, 0.0,  // v4 Green
        1.0, 1.0, -1.0, 0.0, 1.0, 1.0,  // v5 Cyan
        -1.0, 1.0, -1.0, 0.0, 0.0, 1.0,  // v6 Blue
        -1.0, -1.0, -1.0, 0.0, 0.0, 0.0   // v7 Black
    ]);

    // Indices of the vertices
    var indices = new Uint8Array([
        0, 1, 2, 0, 2, 3,    // front
        0, 3, 4, 0, 4, 5,    // right
        0, 5, 6, 0, 6, 1,    // up
        1, 6, 7, 1, 7, 2,    // left
        7, 4, 3, 7, 3, 2,    // down
        4, 7, 6, 4, 6, 5     // back
    ]);

    var n = indices.length;

    // Create a buffer object
    var vertexColorBuffer = this.context.createBuffer();
    var indexBuffer = this.context.createBuffer();
    if (!vertexColorBuffer || !indexBuffer) {
        return -1;
    }

    // Write the vertex coordinates and color to the buffer object
    this.context.bindBuffer(this.context.ARRAY_BUFFER, vertexColorBuffer);
    this.context.bufferData(this.context.ARRAY_BUFFER, verticesColors, this.context.STATIC_DRAW);

    var FSIZE = verticesColors.BYTES_PER_ELEMENT;
    // Assign the buffer object to a_Position and enable the assignment
    var a_Position = this.context.getAttribLocation(this.context.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    this.context.vertexAttribPointer(a_Position, 3, this.context.FLOAT, false, FSIZE * 6, 0);
    this.context.enableVertexAttribArray(a_Position);
    // Assign the buffer object to a_Color and enable the assignment
    var a_Color = this.context.getAttribLocation(this.context.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }
    this.context.vertexAttribPointer(a_Color, 3, this.context.FLOAT, false, FSIZE * 6, FSIZE * 3);
    this.context.enableVertexAttribArray(a_Color);

    // Write the indices to the buffer object
    this.context.bindBuffer(this.context.ELEMENT_ARRAY_BUFFER, indexBuffer);
    this.context.bufferData(this.context.ELEMENT_ARRAY_BUFFER, indices, this.context.STATIC_DRAW);

    this.context.clearColor(0.0, 0.0, 0.0, 1.0);
    this.context.enable(this.context.DEPTH_TEST);

    // Pass the model view projection matrix to u_MvpMatrix
    this.context.uniformMatrix4fv(this.uniforms.u_ViewMatrix.uniformLocation, false, cow.camera.look().data);
    this.context.uniformMatrix4fv(this.uniforms.u_ProjMatrix.uniformLocation, false, cow.camera.project().data);

    // Clear color and depth buffer
    this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

    // Draw the cube
    this.context.drawElements(this.context.TRIANGLES, n, this.context.UNSIGNED_BYTE, 0);

})