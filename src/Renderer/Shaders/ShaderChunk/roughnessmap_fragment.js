//This file is automatically rebuilt by the Speed3DGis build process.
class roughnessmap_fragment{static theWord() {
    return "float roughnessFactor = roughness;\n\
\n\
#ifdef USE_ROUGHNESSMAP\n\
\n\
	vec4 texelRoughness = texture2D( roughnessMap, vUv );\n\
\n\
	// reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture\n\
	roughnessFactor *= texelRoughness.g;\n\
\n\
#endif\n\
";
}} export {roughnessmap_fragment};