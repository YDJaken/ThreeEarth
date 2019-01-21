//This file is automatically rebuilt by the Speed3DGis build process.
class logdepthbuf_pars_fragment{static theWord() {
    return "#ifdef USE_LOGDEPTHBUF\n\
\n\
	uniform float logDepthBufFC;\n\
\n\
	#ifdef USE_LOGDEPTHBUF_EXT\n\
\n\
		varying float vFragDepth;\n\
\n\
	#endif\n\
\n\
#endif\n\
";
}} export {logdepthbuf_pars_fragment};