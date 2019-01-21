//This file is automatically rebuilt by the Speed3DGis build process.
class metalnessmap_fragment{static theWord() {
    return "float metalnessFactor = metalness;\n\
\n\
#ifdef USE_METALNESSMAP\n\
\n\
	vec4 texelMetalness = texture2D( metalnessMap, vUv );\n\
\n\
	// reads channel B, compatible with a combined OcclusionRoughnessMetallic (RGB) texture\n\
	metalnessFactor *= texelMetalness.b;\n\
\n\
#endif\n\
";
}} export {metalnessmap_fragment};