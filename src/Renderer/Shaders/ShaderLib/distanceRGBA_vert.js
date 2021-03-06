//This file is automatically rebuilt by the Speed3DGis build process.
class distanceRGBA_vert{static theWord() {
    return "#define DISTANCE\n\
\n\
varying vec3 vWorldPosition;\n\
\n\
#include <common>\n\
#include <uv_pars_vertex>\n\
#include <displacementmap_pars_vertex>\n\
#include <morphtarget_pars_vertex>\n\
#include <skinning_pars_vertex>\n\
#include <clipping_planes_pars_vertex>\n\
\n\
void main() {\n\
\n\
	#include <uv_vertex>\n\
\n\
	#include <skinbase_vertex>\n\
\n\
	#ifdef USE_DISPLACEMENTMAP\n\
\n\
		#include <beginnormal_vertex>\n\
		#include <morphnormal_vertex>\n\
		#include <skinnormal_vertex>\n\
\n\
	#endif\n\
\n\
	#include <begin_vertex>\n\
	#include <morphtarget_vertex>\n\
	#include <skinning_vertex>\n\
	#include <displacementmap_vertex>\n\
	#include <project_vertex>\n\
	#include <worldpos_vertex>\n\
	#include <clipping_planes_vertex>\n\
\n\
	vWorldPosition = worldPosition.xyz;\n\
\n\
}\n\
";
}} export {distanceRGBA_vert};