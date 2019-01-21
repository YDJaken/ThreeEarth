//This file is automatically rebuilt by the Speed3DGis build process.
class points_vert{static theWord() {
    return "uniform float size;\n\
uniform float scale;\n\
\n\
#include <common>\n\
#include <color_pars_vertex>\n\
#include <fog_pars_vertex>\n\
#include <morphtarget_pars_vertex>\n\
#include <logdepthbuf_pars_vertex>\n\
#include <clipping_planes_pars_vertex>\n\
\n\
void main() {\n\
\n\
	#include <color_vertex>\n\
	#include <begin_vertex>\n\
	#include <morphtarget_vertex>\n\
	#include <project_vertex>\n\
\n\
	#ifdef USE_SIZEATTENUATION\n\
		gl_PointSize = size * ( scale / - mvPosition.z );\n\
	#else\n\
		gl_PointSize = size;\n\
	#endif\n\
\n\
	#include <logdepthbuf_vertex>\n\
	#include <clipping_planes_vertex>\n\
	#include <worldpos_vertex>\n\
	#include <fog_vertex>\n\
\n\
}\n\
";
}} export {points_vert};