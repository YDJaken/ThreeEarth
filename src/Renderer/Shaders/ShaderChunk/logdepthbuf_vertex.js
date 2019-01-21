//This file is automatically rebuilt by the Speed3DGis build process.
class logdepthbuf_vertex{static theWord() {
    return "#ifdef USE_LOGDEPTHBUF\n\
\n\
	#ifdef USE_LOGDEPTHBUF_EXT\n\
\n\
		vFragDepth = 1.0 + gl_Position.w;\n\
\n\
	#else\n\
\n\
		gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;\n\
\n\
		gl_Position.z *= gl_Position.w;\n\
\n\
	#endif\n\
\n\
#endif\n\
";
}} export {logdepthbuf_vertex};