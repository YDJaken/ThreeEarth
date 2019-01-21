//This file is automatically rebuilt by the Speed3DGis build process.
class gradientmap_pars_fragment{static theWord() {
    return "#ifdef TOON\n\
\n\
	uniform sampler2D gradientMap;\n\
\n\
	vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {\n\
\n\
		// dotNL will be from -1.0 to 1.0\n\
		float dotNL = dot( normal, lightDirection );\n\
		vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );\n\
\n\
		#ifdef USE_GRADIENTMAP\n\
\n\
			return texture2D( gradientMap, coord ).rgb;\n\
\n\
		#else\n\
\n\
			return ( coord.x < 0.7 ) ? vec3( 0.7 ) : vec3( 1.0 );\n\
\n\
		#endif\n\
\n\
\n\
	}\n\
\n\
#endif\n\
";
}} export {gradientmap_pars_fragment};