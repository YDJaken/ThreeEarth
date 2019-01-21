//This file is automatically rebuilt by the Speed3DGis build process.
class displacementmap_pars_vertex{static theWord() {
    return "#ifdef USE_DISPLACEMENTMAP\n\
\n\
	uniform sampler2D displacementMap;\n\
	uniform float displacementScale;\n\
	uniform float displacementBias;\n\
\n\
#endif\n\
";
}} export {displacementmap_pars_vertex};