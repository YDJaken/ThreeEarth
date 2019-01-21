//This file is automatically rebuilt by the Speed3DGis build process.
class cube_frag{static theWord() {
    return "uniform samplerCube tCube;\n\
uniform float tFlip;\n\
uniform float opacity;\n\
\n\
varying vec3 vWorldPosition;\n\
\n\
void main() {\n\
\n\
	gl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );\n\
	gl_FragColor.a *= opacity;\n\
\n\
}\n\
";
}} export {cube_frag};