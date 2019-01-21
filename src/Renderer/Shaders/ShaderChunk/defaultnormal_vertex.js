//This file is automatically rebuilt by the Speed3DGis build process.
class defaultnormal_vertex{static theWord() {
    return "vec3 transformedNormal = normalMatrix * objectNormal;\n\
\n\
#ifdef FLIP_SIDED\n\
\n\
	transformedNormal = - transformedNormal;\n\
\n\
#endif\n\
";
}} export {defaultnormal_vertex};