//This file is automatically rebuilt by the Speed3DGis build process.
class project_vertex{static theWord() {
    return "vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );\n\
\n\
gl_Position = projectionMatrix * mvPosition;\n\
";
}} export {project_vertex};