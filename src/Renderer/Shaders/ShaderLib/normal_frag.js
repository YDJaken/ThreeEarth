//This file is automatically rebuilt by the Speed3DGis build process.
class normal_frag{static theWord() {
    return "#define NORMAL\n\
\n\
uniform float opacity;\n\
\n\
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || ( defined( USE_NORMALMAP ) && ! defined( OBJECTSPACE_NORMALMAP ) )\n\
\n\
	varying vec3 vViewPosition;\n\
\n\
#endif\n\
\n\
#ifndef FLAT_SHADED\n\
\n\
	varying vec3 vNormal;\n\
\n\
#endif\n\
\n\
#include <packing>\n\
#include <uv_pars_fragment>\n\
#include <bumpmap_pars_fragment>\n\
#include <normalmap_pars_fragment>\n\
#include <logdepthbuf_pars_fragment>\n\
\n\
void main() {\n\
\n\
	#include <logdepthbuf_fragment>\n\
	#include <normal_fragment_begin>\n\
	#include <normal_fragment_maps>\n\
\n\
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );\n\
\n\
}\n\
";
}} export {normal_frag};