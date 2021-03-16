async function go() {
  let c = document.querySelector('#c');
  let gl = c.getContext('webgl2');
  let vert = await vertex_shader(gl, 'hello');
  let frag = await fragment_shader(gl, 'hello');
  let program = createProgram(gl, vert, frag);

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var positions = [
    0, 0,
    0, 0.5,
    0.7, 0,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.enableVertexAttribArray(positionAttributeLocation);
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
    positionAttributeLocation, size, type, normalize, stride, offset);

  // gl.viewport(0, 0, gl.canvas.width*window.devicePixelRatio, gl.canvas.height*window.devicePixelRatio);

  gl.clearColor(0,0,0,0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

go();

async function vertex_shader(gl, name) {
  let source = await getshadertext(name+'.vertex');
  return createShader(gl, gl.VERTEX_SHADER, source);
}
async function fragment_shader(gl, name) {
  let source = await getshadertext(name+'.frag');
  return createShader(gl, gl.FRAGMENT_SHADER, source);
}

async function getshadertext(name) {
  let res = await fetch("./"+name+".glsl");
  return res.text();
}

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
 
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  throw new Error('Problem compiling shader');
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }
 
  console.error(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  throw new Error('Problem creating program');
}

function programAttributes(gl, program) {
  return new Array(gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)).fill(0).map((_,i)=>gl.getActiveAttrib(program, i));
}
