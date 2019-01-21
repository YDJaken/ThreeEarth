//This file is automatically rebuilt by the Speed3DGis build process.
class fog_pars_fragment{static theWord() {
    return "#ifdef USE_FOG\n\
\n\
	uniform vec3 fogColor;\n\
	varying float fogDepth;\n\
\n\
	#ifdef FOG_EXP2\n\
\n\
		uniform float fogDensity;\n\
\n\
	#else\n\
\n\
		uniform float fogNear;\n\
		uniform float fogFar;\n\
\n\
	#endif\n\
\n\
#endif\n\
";
}} export {fog_pars_fragment};