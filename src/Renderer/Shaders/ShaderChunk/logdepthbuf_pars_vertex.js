//This file is automatically rebuilt by the Speed3DGis build process.
class logdepthbuf_pars_vertex{static theWord() {
    return "#ifdef USE_LOGDEPTHBUF\n\
\n\
	#ifdef USE_LOGDEPTHBUF_EXT\n\
\n\
		varying float vFragDepth;\n\
\n\
	#endif\n\
\n\
	uniform float logDepthBufFC;\n\
\n\
#endif";
}} export {logdepthbuf_pars_vertex};