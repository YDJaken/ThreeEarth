//This file is automatically rebuilt by the Speed3DGis build process.
class lights_fragment_maps{static theWord() {
    return "#if defined( RE_IndirectDiffuse )\n\
\n\
	#ifdef USE_LIGHTMAP\n\
\n\
		vec3 lightMapIrradiance = texture2D( lightMap, vUv2 ).xyz * lightMapIntensity;\n\
\n\
		#ifndef PHYSICALLY_CORRECT_LIGHTS\n\
\n\
			lightMapIrradiance *= PI; // factor of PI should not be present; included here to prevent breakage\n\
\n\
		#endif\n\
\n\
		irradiance += lightMapIrradiance;\n\
\n\
	#endif\n\
\n\
	#if defined( USE_ENVMAP ) && defined( PHYSICAL ) && defined( ENVMAP_TYPE_CUBE_UV )\n\
\n\
		irradiance += getLightProbeIndirectIrradiance( /*lightProbe,*/ geometry, maxMipLevel );\n\
\n\
	#endif\n\
\n\
#endif\n\
\n\
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n\
\n\
	radiance += getLightProbeIndirectRadiance( /*specularLightProbe,*/ geometry, Material_BlinnShininessExponent( material ), maxMipLevel );\n\
\n\
	#ifndef STANDARD\n\
		clearCoatRadiance += getLightProbeIndirectRadiance( /*specularLightProbe,*/ geometry, Material_ClearCoat_BlinnShininessExponent( material ), maxMipLevel );\n\
	#endif\n\
\n\
#endif\n\
";
}} export {lights_fragment_maps};