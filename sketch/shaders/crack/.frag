#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;

void main() {
  gl_FragColor =
      vec4(sin(u_time / 300.), sin(u_time / 150.), sin(u_time / 75.), 1.0);
}
