//This file is automatically rebuilt by the Speed3DGis build process.
class tonemapping_pars_fragment{static theWord() {
    return "#ifndef saturate\n\
	#define saturate(a) clamp( a, 0.0, 1.0 )\n\
#endif\n\
\n\
uniform float toneMappingExposure;\n\
uniform float toneMappingWhitePoint;\n\
\n\
// exposure only\n\
vec3 LinearToneMapping( vec3 color ) {\n\
\n\
	return toneMappingExposure * color;\n\
\n\
}\n\
\n\
// source: https://www.cs.utah.edu/~reinhard/cdrom/\n\
vec3 ReinhardToneMapping( vec3 color ) {\n\
\n\
	color *= toneMappingExposure;\n\
	return saturate( color / ( vec3( 1.0 ) + color ) );\n\
\n\
}\n\
\n\
// source: http://filmicgames.com/archives/75\n\
#define Uncharted2Helper( x ) max( ( ( x * ( 0.15 * x + 0.10 * 0.50 ) + 0.20 * 0.02 ) / ( x * ( 0.15 * x + 0.50 ) + 0.20 * 0.30 ) ) - 0.02 / 0.30, vec3( 0.0 ) )\n\
vec3 Uncharted2ToneMapping( vec3 color ) {\n\
\n\
	// John Hable's filmic operator from Uncharted 2 video game\n\
	color *= toneMappingExposure;\n\
	return saturate( Uncharted2Helper( color ) / Uncharted2Helper( vec3( toneMappingWhitePoint ) ) );\n\
\n\
}\n\
\n\
// source: http://filmicgames.com/archives/75\n\
vec3 OptimizedCineonToneMapping( vec3 color ) {\n\
\n\
	// optimized filmic operator by Jim Hejl and Richard Burgess-Dawson\n\
	color *= toneMappingExposure;\n\
	color = max( vec3( 0.0 ), color - 0.004 );\n\
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n\
\n\
}\n\
";
}} export {tonemapping_pars_fragment};