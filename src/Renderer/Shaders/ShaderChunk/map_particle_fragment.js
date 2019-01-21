//This file is automatically rebuilt by the Speed3DGis build process.
class map_particle_fragment{static theWord() {
    return "#ifdef USE_MAP\n\
\n\
	vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;\n\
	vec4 mapTexel = texture2D( map, uv );\n\
	diffuseColor *= mapTexelToLinear( mapTexel );\n\
\n\
#endif\n\
";
}} export {map_particle_fragment};