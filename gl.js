async function go() {
  let c = document.querySelector('#c');
  let gl = c.getContext('webgl2');
  let vert = await vertex_shader(gl, 'hello');
  let frag = await fragment_shader(gl, 'hello');
  let program = createProgram(gl, vert, frag);

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  console.log(programAttributes(gl, program));
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
