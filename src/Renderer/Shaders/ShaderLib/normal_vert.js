//This file is automatically rebuilt by the Speed3DGis build process.
class normal_vert{static theWord() {
    return "#define NORMAL\n\
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
#include <uv_pars_vertex>\n\
#include <displacementmap_pars_vertex>\n\
#include <morphtarget_pars_vertex>\n\
#include <skinning_pars_vertex>\n\
#include <logdepthbuf_pars_vertex>\n\
\n\
void main() {\n\
\n\
	#include <uv_vertex>\n\
\n\
	#include <beginnormal_vertex>\n\
	#include <morphnormal_vertex>\n\
	#include <skinbase_vertex>\n\
	#include <skinnormal_vertex>\n\
	#include <defaultnormal_vertex>\n\
\n\
#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED\n\
\n\
	vNormal = normalize( transformedNormal );\n\
\n\
#endif\n\
\n\
	#include <begin_vertex>\n\
	#include <morphtarget_vertex>\n\
	#include <skinning_vertex>\n\
	#include <displacementmap_vertex>\n\
	#include <project_vertex>\n\
	#include <logdepthbuf_vertex>\n\
\n\
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || ( defined( USE_NORMALMAP ) && ! defined( OBJECTSPACE_NORMALMAP ) )\n\
\n\
	vViewPosition = - mvPosition.xyz;\n\
\n\
#endif\n\
\n\
}\n\
";
}} export {normal_vert};