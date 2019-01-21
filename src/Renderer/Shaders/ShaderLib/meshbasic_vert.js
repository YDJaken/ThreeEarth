//This file is automatically rebuilt by the Speed3DGis build process.
class meshbasic_vert{static theWord() {
    return "#include <common>\n\
#include <uv_pars_vertex>\n\
#include <uv2_pars_vertex>\n\
#include <envmap_pars_vertex>\n\
#include <color_pars_vertex>\n\
#include <fog_pars_vertex>\n\
#include <morphtarget_pars_vertex>\n\
#include <skinning_pars_vertex>\n\
#include <logdepthbuf_pars_vertex>\n\
#include <clipping_planes_pars_vertex>\n\
\n\
void main() {\n\
\n\
	#include <uv_vertex>\n\
	#include <uv2_vertex>\n\
	#include <color_vertex>\n\
	#include <skinbase_vertex>\n\
\n\
	#ifdef USE_ENVMAP\n\
\n\
	#include <beginnormal_vertex>\n\
	#include <morphnormal_vertex>\n\
	#include <skinnormal_vertex>\n\
	#include <defaultnormal_vertex>\n\
\n\
	#endif\n\
\n\
	#include <begin_vertex>\n\
	#include <morphtarget_vertex>\n\
	#include <skinning_vertex>\n\
	#include <project_vertex>\n\
	#include <logdepthbuf_vertex>\n\
\n\
	#include <worldpos_vertex>\n\
	#include <clipping_planes_vertex>\n\
	#include <envmap_vertex>\n\
	#include <fog_vertex>\n\
\n\
}\n\
";
}} export {meshbasic_vert};