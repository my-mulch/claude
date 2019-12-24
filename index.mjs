window.cow = new app(
    await io.txtread('./res/shaders/rgb/shader.vert'),
    await io.txtread('./res/shaders/rgb/shader.frag'))

const colors = bb.tensor(await io.imread('./res/images/froot.jpg')).reshape([-1, 3])
const vertices = colors.subtract({ with: 0.5 })

cow.plot([{ vertices, colors }])

cow.render()

// cow.gl.do(function () {
//     var vertices = new Float32Array([
//         0, 0.2,
//         -0.2, -0.2,
//         0.2, -0.2,

//         0 + 0.4, 0.2 + 0.4,
//         -0.2 + 0.4, -0.2 + 0.4,
//         0.2 + 0.4, -0.2 + 0.4,
//     ]);
//     var n = 6;   // The number of vertices

//     // Create a buffer object
//     var vertexBuffer = this.context.createBuffer();
//     if (!vertexBuffer) {
//         console.log('Failed to create the buffer object');
//         return -1;
//     }

//     // Bind the buffer object to target
//     this.context.bindBuffer(this.context.ARRAY_BUFFER, vertexBuffer);
//     // Write date into the buffer object
//     this.context.bufferData(this.context.ARRAY_BUFFER, vertices, this.context.STATIC_DRAW);

//     // Assign the buffer object to a_Position variable
//     var a_Position = this.context.getAttribLocation(this.context.program, 'a_Position');
//     if (a_Position < 0) {
//         console.log('Failed to get the storage location of a_Position');
//         return -1;
//     }
//     this.context.vertexAttribPointer(a_Position, 2, this.context.FLOAT, false, 0, 0);

//     // Enable the assignment to a_Position variable
//     this.context.enableVertexAttribArray(a_Position);

//     this.context.clearColor(0.0, 0.0, 0.0, 1.0);

//     // Get storage location of u_ModelMatrix
//     var u_ModelMatrix = this.context.getUniformLocation(this.context.program, 'u_ModelMatrix');
//     if (!u_ModelMatrix) {
//         console.log('Failed to get the storage location of u_ModelMatrix');
//         return;
//     }

//     // Model matrix
//     var modelMatrix = bb.eye([4, 4]);

//     // Start drawing
//     var tick = function () {
//         const time = Date.now() / 1000

//         const s = Math.sin(time)
//         const c = Math.cos(time)

//         // Set the rotation matrix
//         modelMatrix.data[0] = c
//         modelMatrix.data[1] = s
//         modelMatrix.data[4] = -s
//         modelMatrix.data[5] = c

//         // Pass the rotation matrix to the vertex shader
//         this.context.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.data);

//         // Clear <canvas>
//         this.context.clear(this.context.COLOR_BUFFER_BIT);

//         // Draw the rectangle
//         this.context.drawArrays(this.context.TRIANGLES, 0, n);

//         requestAnimationFrame(tick, cow.canvas); // Request that the browser calls tick
//     }.bind(this);
//     tick();

// })
