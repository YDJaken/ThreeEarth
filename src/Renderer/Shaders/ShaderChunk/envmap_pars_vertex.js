//This file is automatically rebuilt by the Speed3DGis build process.
class envmap_pars_vertex{static theWord() {
    return "#ifdef USE_ENVMAP\n\
\n\
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )\n\
		varying vec3 vWorldPosition;\n\
\n\
	#else\n\
\n\
		varying vec3 vReflect;\n\
		uniform float refractionRatio;\n\
\n\
	#endif\n\
\n\
#endif\n\
";
}} export {envmap_pars_vertex};