

const program = webgl
    .program({
        canvas: app.canvas,
        vertexSource: await io.txtread('./webgl/click/shader.vert'),
        fragmentSource: await io.txtread('./webgl/click/shader.frag'),
    }).do(function () {
        /** Variables */
        const aPosIndex = this.attributes.a_Position.attributeLocation
        const aSizeIndex = this.attributes.a_PointSize.attributeLocation

        /** GPU Data */
        this.context.vertexAttrib3f(aPosIndex, 0.2, -0.1, .3);
        this.context.vertexAttrib1f(aSizeIndex, 80);

    }).do(function () {
        /** Clear color */
        this.context.clearColor(0., 0.0, 0.0, 1.0)

        /** Clear <canvas> to set color */
        this.context.clear(this.context.COLOR_BUFFER_BIT)

        /** Draw */
        this.context.drawArrays(this.context.POINTS, 0, 2)
    })









// var g_points = []; // The array for the position of a mouse press
// function click(ev, gl, canvas, a_Position) {
//     var x = ev.clientX; // x coordinate of a mouse pointer
//     var y = ev.clientY; // y coordinate of a mouse pointer
//     var rect = ev.target.getBoundingClientRect();

//     x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
//     y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
//     // Store the coordinates to g_points array
//     g_points.push(x); g_points.push(y);

//     // Clear <canvas>
//     gl.clear(gl.COLOR_BUFFER_BIT);

//     var len = g_points.length;
//     for (var i = 0; i < len; i += 2) {
//         // Pass the position of a point to a_Position variable
//         gl.vertexAttrib3f(a_Position, g_points[i], g_points[i + 1], 0.0);

//         // Draw
//         gl.drawArrays(gl.POINTS, 0, 1);
//     }
// }
