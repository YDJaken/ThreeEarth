//This file is automatically rebuilt by the Speed3DGis build process.
class depth_frag{static theWord() {
    return "#if DEPTH_PACKING == 3200\n\
\n\
	uniform float opacity;\n\
\n\
#endif\n\
\n\
#include <common>\n\
#include <packing>\n\
#include <uv_pars_fragment>\n\
#include <map_pars_fragment>\n\
#include <alphamap_pars_fragment>\n\
#include <logdepthbuf_pars_fragment>\n\
#include <clipping_planes_pars_fragment>\n\
\n\
void main() {\n\
\n\
	#include <clipping_planes_fragment>\n\
\n\
	vec4 diffuseColor = vec4( 1.0 );\n\
\n\
	#if DEPTH_PACKING == 3200\n\
\n\
		diffuseColor.a = opacity;\n\
\n\
	#endif\n\
\n\
	#include <map_fragment>\n\
	#include <alphamap_fragment>\n\
	#include <alphatest_fragment>\n\
\n\
	#include <logdepthbuf_fragment>\n\
\n\
	#if DEPTH_PACKING == 3200\n\
\n\
		gl_FragColor = vec4( vec3( 1.0 - gl_FragCoord.z ), opacity );\n\
\n\
	#elif DEPTH_PACKING == 3201\n\
\n\
		gl_FragColor = packDepthToRGBA( gl_FragCoord.z );\n\
\n\
	#endif\n\
\n\
}\n\
";
}} export {depth_frag};