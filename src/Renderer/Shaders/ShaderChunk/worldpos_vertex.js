//This file is automatically rebuilt by the Speed3DGis build process.
class worldpos_vertex{static theWord() {
    return "#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP )\n\
\n\
	vec4 worldPosition = modelMatrix * vec4( transformed, 1.0 );\n\
\n\
#endif\n\
";
}} export {worldpos_vertex};