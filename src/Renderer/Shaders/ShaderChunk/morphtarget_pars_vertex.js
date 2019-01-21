//This file is automatically rebuilt by the Speed3DGis build process.
class morphtarget_pars_vertex{static theWord() {
    return "#ifdef USE_MORPHTARGETS\n\
\n\
	#ifndef USE_MORPHNORMALS\n\
\n\
	uniform float morphTargetInfluences[ 8 ];\n\
\n\
	#else\n\
\n\
	uniform float morphTargetInfluences[ 4 ];\n\
\n\
	#endif\n\
\n\
#endif";
}} export {morphtarget_pars_vertex};