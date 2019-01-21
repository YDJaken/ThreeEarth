//This file is automatically rebuilt by the Speed3DGis build process.
class lights_pars_maps{static theWord() {
    return "#if defined( USE_ENVMAP ) && defined( PHYSICAL )\n\
\n\
	vec3 getLightProbeIndirectIrradiance( /*const in SpecularLightProbe specularLightProbe,*/ const in GeometricContext geometry, const in int maxMIPLevel ) {\n\
\n\
		vec3 worldNormal = inverseTransformDirection( geometry.normal, viewMatrix );\n\
\n\
		#ifdef ENVMAP_TYPE_CUBE\n\
\n\
			vec3 queryVec = vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n\
\n\
			// TODO: replace with properly filtered cubemaps and access the irradiance LOD level, be it the last LOD level\n\
			// of a specular cubemap, or just the default level of a specially created irradiance cubemap.\n\
\n\
			#ifdef TEXTURE_LOD_EXT\n\
\n\
				vec4 envMapColor = textureCubeLodEXT( envMap, queryVec, float( maxMIPLevel ) );\n\
\n\
			#else\n\
\n\
				// force the bias high to get the last LOD level as it is the most blurred.\n\
				vec4 envMapColor = textureCube( envMap, queryVec, float( maxMIPLevel ) );\n\
\n\
			#endif\n\
\n\
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\
\n\
		#elif defined( ENVMAP_TYPE_CUBE_UV )\n\
\n\
			vec3 queryVec = vec3( flipEnvMap * worldNormal.x, worldNormal.yz );\n\
			vec4 envMapColor = textureCubeUV( queryVec, 1.0 );\n\
\n\
		#else\n\
\n\
			vec4 envMapColor = vec4( 0.0 );\n\
\n\
		#endif\n\
\n\
		return PI * envMapColor.rgb * envMapIntensity;\n\
\n\
	}\n\
\n\
	// taken from here: http://casual-effects.blogspot.ca/2011/08/plausible-environment-lighting-in-two.html\n\
	float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {\n\
\n\
		//float envMapWidth = pow( 2.0, maxMIPLevelScalar );\n\
		//float desiredMIPLevel = log2( envMapWidth * sqrt( 3.0 ) ) - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );\n\
\n\
		float maxMIPLevelScalar = float( maxMIPLevel );\n\
		float desiredMIPLevel = maxMIPLevelScalar + 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );\n\
\n\
		// clamp to allowable LOD ranges.\n\
		return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );\n\
\n\
	}\n\
\n\
	vec3 getLightProbeIndirectRadiance( /*const in SpecularLightProbe specularLightProbe,*/ const in GeometricContext geometry, const in float blinnShininessExponent, const in int maxMIPLevel ) {\n\
\n\
		#ifdef ENVMAP_MODE_REFLECTION\n\
\n\
			vec3 reflectVec = reflect( -geometry.viewDir, geometry.normal );\n\
\n\
		#else\n\
\n\
			vec3 reflectVec = refract( -geometry.viewDir, geometry.normal, refractionRatio );\n\
\n\
		#endif\n\
\n\
		reflectVec = inverseTransformDirection( reflectVec, viewMatrix );\n\
\n\
		float specularMIPLevel = getSpecularMIPLevel( blinnShininessExponent, maxMIPLevel );\n\
\n\
		#ifdef ENVMAP_TYPE_CUBE\n\
\n\
			vec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n\
\n\
			#ifdef TEXTURE_LOD_EXT\n\
\n\
				vec4 envMapColor = textureCubeLodEXT( envMap, queryReflectVec, specularMIPLevel );\n\
\n\
			#else\n\
\n\
				vec4 envMapColor = textureCube( envMap, queryReflectVec, specularMIPLevel );\n\
\n\
			#endif\n\
\n\
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\
\n\
		#elif defined( ENVMAP_TYPE_CUBE_UV )\n\
\n\
			vec3 queryReflectVec = vec3( flipEnvMap * reflectVec.x, reflectVec.yz );\n\
			vec4 envMapColor = textureCubeUV(queryReflectVec, BlinnExponentToGGXRoughness(blinnShininessExponent));\n\
\n\
		#elif defined( ENVMAP_TYPE_EQUIREC )\n\
\n\
			vec2 sampleUV;\n\
			sampleUV.y = asin( clamp( reflectVec.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n\
			sampleUV.x = atan( reflectVec.z, reflectVec.x ) * RECIPROCAL_PI2 + 0.5;\n\
\n\
			#ifdef TEXTURE_LOD_EXT\n\
\n\
				vec4 envMapColor = texture2DLodEXT( envMap, sampleUV, specularMIPLevel );\n\
\n\
			#else\n\
\n\
				vec4 envMapColor = texture2D( envMap, sampleUV, specularMIPLevel );\n\
\n\
			#endif\n\
\n\
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\
\n\
		#elif defined( ENVMAP_TYPE_SPHERE )\n\
\n\
			vec3 reflectView = normalize( ( viewMatrix * vec4( reflectVec, 0.0 ) ).xyz + vec3( 0.0,0.0,1.0 ) );\n\
\n\
			#ifdef TEXTURE_LOD_EXT\n\
\n\
				vec4 envMapColor = texture2DLodEXT( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );\n\
\n\
			#else\n\
\n\
				vec4 envMapColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5, specularMIPLevel );\n\
\n\
			#endif\n\
\n\
			envMapColor.rgb = envMapTexelToLinear( envMapColor ).rgb;\n\
\n\
		#endif\n\
\n\
		return envMapColor.rgb * envMapIntensity;\n\
\n\
	}\n\
\n\
#endif\n\
";
}} export {lights_pars_maps};