//This file is automatically rebuilt by the Speed3DGis build process.
class logdepthbuf_fragment{static theWord() {
    return "#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )\n\
\n\
	gl_FragDepthEXT = log2( vFragDepth ) * logDepthBufFC * 0.5;\n\
\n\
#endif";
}} export {logdepthbuf_fragment};