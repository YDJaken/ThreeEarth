//This file is automatically rebuilt by the Speed3DGis build process.
class displacementmap_vertex{static theWord() {
    return "#ifdef USE_DISPLACEMENTMAP\n\
\n\
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, uv ).x * displacementScale + displacementBias );\n\
\n\
#endif\n\
";
}} export {displacementmap_vertex};