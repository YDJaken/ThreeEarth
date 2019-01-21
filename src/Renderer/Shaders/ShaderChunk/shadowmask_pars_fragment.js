//This file is automatically rebuilt by the Speed3DGis build process.
class shadowmask_pars_fragment{static theWord() {
    return "float getShadowMask() {\n\
\n\
	float shadow = 1.0;\n\
\n\
	#ifdef USE_SHADOWMAP\n\
\n\
	#if NUM_DIR_LIGHTS > 0\n\
\n\
	DirectionalLight directionalLight;\n\
\n\
	#pragma unroll_loop\n\
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\
\n\
		directionalLight = directionalLights[ i ];\n\
		shadow *= bool( directionalLight.shadow ) ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n\
\n\
	}\n\
\n\
	#endif\n\
\n\
	#if NUM_SPOT_LIGHTS > 0\n\
\n\
	SpotLight spotLight;\n\
\n\
	#pragma unroll_loop\n\
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\
\n\
		spotLight = spotLights[ i ];\n\
		shadow *= bool( spotLight.shadow ) ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[ i ] ) : 1.0;\n\
\n\
	}\n\
\n\
	#endif\n\
\n\
	#if NUM_POINT_LIGHTS > 0\n\
\n\
	PointLight pointLight;\n\
\n\
	#pragma unroll_loop\n\
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\
\n\
		pointLight = pointLights[ i ];\n\
		shadow *= bool( pointLight.shadow ) ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;\n\
\n\
	}\n\
\n\
	#endif\n\
\n\
	/*\n\
	#if NUM_RECT_AREA_LIGHTS > 0\n\
\n\
		// TODO (abelnation): update shadow for Area light\n\
\n\
	#endif\n\
	*/\n\
\n\
	#endif\n\
\n\
	return shadow;\n\
\n\
}\n\
";
}} export {shadowmask_pars_fragment};