//This file is automatically rebuilt by the Speed3DGis build process.
class envmap_pars_fragment{static theWord() {
    return "#if defined( USE_ENVMAP ) || defined( PHYSICAL )\n\
	uniform float reflectivity;\n\
	uniform float envMapIntensity;\n\
#endif\n\
\n\
#ifdef USE_ENVMAP\n\
\n\
	#if ! defined( PHYSICAL ) && ( defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) )\n\
		varying vec3 vWorldPosition;\n\
	#endif\n\
\n\
	#ifdef ENVMAP_TYPE_CUBE\n\
		uniform samplerCube envMap;\n\
	#else\n\
		uniform sampler2D envMap;\n\
	#endif\n\
	uniform float flipEnvMap;\n\
	uniform int maxMipLevel;\n\
\n\
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( PHYSICAL )\n\
		uniform float refractionRatio;\n\
	#else\n\
		varying vec3 vReflect;\n\
	#endif\n\
\n\
#endif\n\
";
}} export {envmap_pars_fragment};