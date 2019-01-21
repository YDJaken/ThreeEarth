//This file is automatically rebuilt by the Speed3DGis build process.
class aomap_fragment{static theWord() {
    return "#ifdef USE_AOMAP\n\
\n\
	// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture\n\
	float ambientOcclusion = ( texture2D( aoMap, vUv2 ).r - 1.0 ) * aoMapIntensity + 1.0;\n\
\n\
	reflectedLight.indirectDiffuse *= ambientOcclusion;\n\
\n\
	#if defined( USE_ENVMAP ) && defined( PHYSICAL )\n\
\n\
		float dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\
\n\
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.specularRoughness );\n\
\n\
	#endif\n\
\n\
#endif\n\
";
}} export {aomap_fragment};